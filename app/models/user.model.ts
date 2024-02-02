import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  signUpDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
