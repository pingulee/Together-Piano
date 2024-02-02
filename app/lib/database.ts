import mongoose from 'mongoose';

// MongoDB 연결 URI
const uri = 'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('데이터베이스 연결 성공');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};
