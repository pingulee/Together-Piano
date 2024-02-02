// components/PostList.tsx
import React from 'react';

interface Post {
  _id: string;
  title: string;
  nickname: string;
  createdAt: Date;
  views: number;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div>
      <h2>게시판 목록</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <span>{post.title} </span>
            <span>({post.nickname}, </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}, </span>
            <span>조회수: {post.views})</span>  
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
