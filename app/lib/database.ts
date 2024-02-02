import mongoose from 'mongoose';

// MongoDB 연결 URI
const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/togetherpiano';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDatabase() {
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
