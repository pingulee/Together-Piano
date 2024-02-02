import mongoose, { Connection } from 'mongoose';

// MongoDB 연결 URI
const uri = 'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/';

/**
 * 데이터베이스에 연결하는 함수
 * @param {string} uri - MongoDB 연결 URI
 * @returns {Promise<Connection>} - Mongoose Connection 객체의 프로미스
 */
export const connectDatabase = async (uri: string): Promise<Connection> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      // 이미 연결된 경우에는 재연결하지 않음
      return mongoose.connection;
    }

    // Mongoose 연결 설정
    await mongoose.connect(uri);

    // 연결이 성공적으로 완료된 경우 Connection 객체 반환
    return mongoose.connection;
  } catch (error) {
    throw new Error(`데이터베이스 연결 오류: ${error}`);
  }
};