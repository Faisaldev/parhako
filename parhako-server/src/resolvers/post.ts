import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';
import { Updoot } from '../entities/Updoot';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';

@InputType()
class PostInput {
  @Field()
  title!: string;
  @Field()
  text!: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts?: Post[];

  @Field()
  hasMore!: boolean;
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const maxLimit = Math.min(50, limit);
    const maxLimitPlusOne = Math.min(50, limit) + 1;

    const predicates: any[] = [maxLimitPlusOne];
    if (req.session.userId) {
      predicates.push(req.session.userId);
    }
    let cursorIdx = 3;
    if (cursor) {
      predicates.push(new Date(parseInt(cursor)));
      cursorIdx = predicates.length;
    }

    const posts = await getConnection().query(
      `
    select p.*,
    json_build_object('id',u.id,'username',u.username, 'email',u.email) creator,
    ${
      req.session.userId
        ? '(select value from updoot where "userId"=$2 and "postId"=p.id) "voteStatus"'
        : 'NULL as "voteStatus"'
    }
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $${cursorIdx}` : ''}
    order by "createdAt" DESC
    limit $1
    `,
      predicates
    );

    return {
      posts: posts.slice(0, maxLimit),
      hasMore: posts.length === maxLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id, { relations: ['creator'] });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;

    const realValue = value !== -1 ? 1 : -1;

    // await Updoot.insert({
    //   userId,
    //   postId,
    //   value: realValue,
    // });

    //check if user voted before
    const updoot = await Updoot.findOne({ where: { userId, postId } });

    if (updoot && updoot.value !== realValue) {
      //Voted but not the same value
      await getConnection().transaction(async tm => {
        await tm.query(
          `
        update updoot
    set value=$3
    where "postId"=$1 and "userId"=$2`,
          [postId, userId, realValue]
        );

        await tm.query(
          `
        update post
    set points=points + $2
    where id=$1`,
          [postId, 2 * realValue]
        );
      });
    } else if (!updoot) {
      //not voted before
      await getConnection().transaction(async tm => {
        await tm.query(
          `
        insert into updoot ("userId", "postId", value)
    values ($1,$2, $3);`,
          [userId, postId, realValue]
        );

        await tm.query(
          `
        update post
    set points=points + $2
    where id=$1`,
          [postId, realValue]
        );
      });
    }

    return true;
  }
}
