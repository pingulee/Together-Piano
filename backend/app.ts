// server.js 또는 app.js
import express from 'express';
import http from 'http';
import session from 'express-session';
import passport from 'passport';
import socket from './socket';
import googleAuth from './auth/google';

const port = 3288;
const app = express();
const server = http.createServer(app);

// 세션 설정
app.use(
  session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }),
);

// Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());

// 구글 로그인 라우트 사용
app.use('/auth', googleAuth);

// 소켓 설정
socket(server);

// 서버 시작
server.listen(port, () => console.log(`Port : ${port}`));
