# Together Piano
## 설명
온라인에서 피아노를 연주 하고 소통할 수 있는 웹 애플리케이션
## 설치
- npm install
- npm install express
- npm install socket.io

## 사용 기술과 그 이유
### Socket.IO
- Together Piano 개발 초창기 http 통신 방식인 XMLHttpRequest, Fetch API, Axios, AJAX를 각각 사용해봤습니다. 클라이언트가 서버에게 요청을 보내고, 서버가 응답을 보내는 '단방향'통신이기에 상태를 유지하지 않아 실시간 데이터를 전송해야하는 서비스의 취지에 맞지 않다 판단했습니다. 따라서 양방향 통신이 가능한 Socket 통신을 사용하기로 했습니다.  
먼저 WebSocket을 사용하였습니다. 하지만 Together Piano는 서버에서 연결된 소켓(사용자)들을 세밀하게 관리해야하는 서비스이기 때문에 Broadcasting 기능이 있는 Socket.IO을 쓰는게 유지보수 측면에서 훨씬 이점이 많다고 판단되여 채택했습니다.
### Typescript
- 변수, 함수, 객체 등에 타입을 명시할 수 있습니다. 이는 코드의 가독성을 높이고 디버깅을 용이하게 만듭니다. 정적 타입 검사를 통해 런타임 오류를 사전에 방지할 수 있어 안정성이 향상되기에 채택했습니다.
- TypeScript 에디터는 코드 어시스트와 자동 완성을 지원하여 개발자가 빠르게 코드를 작성하고 API를 사용할 수 있도록 도와주기 때문에 개발 생산성을 향상시키기 위해 채택했습니다.
- 최신 ECMAScript 기능을 지원합니다. ECMAScript 방식을 사용하는 Together Piano는 타입스크립트를 사용하기 최적의 조건이라 판단되여 채택했습니다.
- 타입 정보를 기반으로 코드를 변경하면, 관련된 부분을 자동으로 업데이트하거나 오류를 사전에 감지할 수 있는 강력한 리팩터링 기능을 지원하기 때문에 보다 완벽한 서비스를 제공하기 위해 채택했습니다.
## 특징
## 진행 상황
## 개선점
## 참조
https://nodejs.org/  
https://expressjs.com/  
https://socket.io/  
https://developer.mozilla.org/ko/  
https://www.npmjs.com/  
