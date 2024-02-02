// models/Post.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  title: string;
  nickname: string;
  content: string;
  createdAt: Date;
  views: number;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
});

export default mongoose.model<IPost>('Post', PostSchema);
