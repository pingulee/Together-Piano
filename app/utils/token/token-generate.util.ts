export default function tokenGenerate(tokenLength = 15) {
  const characters = '0123456789ABCDEF';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    token += characters[Math.floor(Math.random() * 16)];
  }
  return token;
}
