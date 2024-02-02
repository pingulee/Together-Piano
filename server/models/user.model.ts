import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
  },
  color: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model('User', userSchema);
