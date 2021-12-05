import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootProps {
  // post: PostsQuery['posts']['posts'][0];
  post: PostSnippetFragment;
}

const Updoot: React.FC<UpdootProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();

  return (
    <Flex direction='column' alignItems='center' mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState('updoot-loading');
          await vote({
            value: 1,
            postId: post.id,
          });
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={loadingState === 'updoot-loading'}
        aria-label='updoot post'
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState('downdoot-loading');
          await vote({
            value: -1,
            postId: post.id,
          });
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        isLoading={loadingState === 'downdoot-loading'}
        aria-label='downdoot post'
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
export default Updoot;
