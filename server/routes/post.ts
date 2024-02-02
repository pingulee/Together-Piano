import express, { Request, Response } from 'express';
import Post from '@/server/models/post.model';

const router = express.Router();

// 게시글 목록 조회
router.get('/', async (req: Request, res: Response) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 게시글 상세 조회
router.get('/:id', async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  post.views += 1; // 조회수 증가
  await post.save();
  res.json(post);
});

// 게시글 등록
router.post('/', async (req: Request, res: Response) => {
  const { title, nickname, content } = req.body;
  const newPost = new Post({ title, nickname, content });
  await newPost.save();
  res.status(201).json(newPost);
});

// 게시글 수정
router.put('/:id', async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true },
  );
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  res.json(post);
});

// 게시글 삭제
router.delete('/:id', async (req: Request, res: Response) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;
