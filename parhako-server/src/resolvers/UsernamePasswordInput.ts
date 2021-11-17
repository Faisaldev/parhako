import { Field, InputType } from 'type-graphql';

//Input types for arguments
@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}
