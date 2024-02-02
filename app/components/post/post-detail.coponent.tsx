// components/PostDetail.tsx
import React from 'react';

interface Post {
  title: string;
  nickname: string;
  content: string;
  createdAt: Date;
  views: number;
}

interface PostDetailProps {
  post: Post;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.nickname} ({new Date(post.createdAt).toLocaleDateString()})</p>
      <p>조회수: {post.views}</p>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;
