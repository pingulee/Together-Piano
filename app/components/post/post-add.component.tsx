// components/PostAdd.tsx
import React, { useState } from 'react';

interface PostAddProps {
  onSubmit: (post: { title: string; nickname: string; content: string }) => void;
}

const PostAdd: React.FC<PostAddProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, nickname, content });
    setTitle('');
    setNickname('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>새 게시글 작성</h2>
      <div>
        <label>제목: </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label>닉네임: </label>
        <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} />
      </div>
      <div>
        <label>내용: </label>
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button type="submit">게시글 작성</button>
    </form>
  );
};

export default PostAdd;
