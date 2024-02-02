import mongoose from 'mongoose';

// MongoDB 연결 URI
const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/togetherpiano';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export const connectDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('데이터베이스 연결 성공');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};
