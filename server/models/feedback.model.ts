import mongoose, { Document, Schema } from 'mongoose';

interface IFeedback extends Document {
  username: string;
  feedback: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  username: { type: String, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
