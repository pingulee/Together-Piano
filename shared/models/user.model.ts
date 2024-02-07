import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  signUpDate: {
    type: Date,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
