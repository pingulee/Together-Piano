import mongoose from 'mongoose';

const uri = 'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/';

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(uri);
};
