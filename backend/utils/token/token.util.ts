import tokenGenerate from '@/utils/token/token-generate.util';

function issueToken() {
  const token = tokenGenerate(); // 토큰 생성
  localStorage.setItem('userToken', token); // 로컬 스토리지에 저장
  return token;
}

function getUserToken() {
  return localStorage.getItem('userToken');
}

export { issueToken, getUserToken };
