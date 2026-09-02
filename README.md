# Together Piano

여러 사람이 각자의 브라우저에서 같은 피아노를 함께 연주하고, 옆에서 채팅하는 웹앱입니다.
마우스와 MIDI 건반 입력을 모두 받습니다.

## 기술 스택

| 영역   | 사용 기술                                      |
| ------ | ---------------------------------------------- |
| 프론트 | Next 16 (App Router), React 19, Tailwind CSS 4 |
| 실시간 | socket.io 4                                    |
| 서버   | Express 5, Node 24                             |
| 인증   | NextAuth (Google / Discord), SQLite + Drizzle  |
| 도구   | TypeScript 7, oxlint, Prettier                 |

## 구조

```
app/
  (pages)/            라우트별 페이지
  api/auth/           NextAuth 라우트 핸들러
  components/         화면 조각
  hooks/              클라이언트 훅
  lib/                순수 로직 (음 계산, 오디오, 소켓, 환경변수)
  providers/          세션/소켓 수명주기
  styles/globals.css  Tailwind 진입점 + 디자인 토큰
server/
  server.ts           Next + socket.io 단일 서버 진입점
  socket-server.ts    소켓 전용 진입점 (프론트를 따로 배포할 때)
  socket.ts           소켓 이벤트 처리
shared/
  socket-events.ts    클라이언트/서버가 공유하는 이벤트 계약 (타입 전용)
  db/                 Drizzle 스키마 + SQLite 연결 + 마이그레이션
drizzle/              생성된 마이그레이션 SQL
```

`shared/socket-events.ts` 가 실시간 통신의 유일한 정의입니다. 이벤트 이름이나 페이로드를
바꾸면 양쪽에서 타입 오류로 드러나므로, 한쪽만 고쳐 배포하는 사고를 막습니다.

## 시작하기

```bash
cp .env.example .env.local   # 값을 채우세요
npm ci
npm run dev:server           # Next + 소켓을 함께 띄웁니다 (http://localhost:3000)
```

`npm run dev` 는 Next 개발 서버만 띄우므로 실시간 기능이 동작하지 않습니다.
합주와 채팅을 확인하려면 `npm run dev:server` 를 쓰세요.

### 스크립트

| 스크립트                  | 설명                              |
| ------------------------- | --------------------------------- |
| `dev:server`              | Next + 소켓 개발 서버 (권장)      |
| `dev`                     | Next 개발 서버만                  |
| `dev:socket`              | 소켓 서버만                       |
| `build`                   | 프론트 + 서버 빌드                |
| `start` / `start:socket`  | 빌드 결과 실행 (단일 / 소켓 전용) |
| `lint`                    | oxlint                            |
| `typecheck`               | 타입 검사                         |
| `format` / `format:check` | Prettier                          |

## 배포

Mac mini 한 대에서 Docker 로 돌리고, Cloudflare Tunnel 로 외부에 노출합니다.

실시간 합주는 서버가 접속을 계속 유지해야 하므로 **socket.io 는 상시 실행 프로세스가
필요합니다.** Lambda 기반 런타임(Amplify Hosting SSR, API Gateway + Lambda 등)에서는
연결이 유지되지 않거나 메시지마다 왕복 지연이 붙어 합을 맞출 수 없습니다.

터널을 쓰는 이유는 두 가지입니다. 가정용 회선은 80·443 인바운드가 막혀 있거나 사설
주소(CGNAT)를 받는 경우가 많아 포트 포워딩이 아예 불가능하고, OAuth 로그인은
`https://` 리디렉션 URI 를 요구해 인증서가 반드시 필요합니다. Cloudflare Tunnel 은
포트를 열지 않고 두 문제를 함께 해결하며 WebSocket 을 그대로 통과시킵니다.

### 실행

```bash
cp .env.example .env.local   # 값을 채우세요
docker compose up -d --build
docker compose logs -f app
```

컨테이너는 `127.0.0.1:3000` 에만 바인딩됩니다. 외부 노출은 터널이 담당하므로
방화벽에 구멍을 낼 필요가 없습니다.

로그인 정보는 SQLite 파일 하나(`piano-data` 볼륨의 `/data/app.db`)에 들어갑니다.
스키마는 서버가 부팅할 때 `drizzle/` 의 마이그레이션을 적용해 맞춥니다.
백업은 그 파일을 복사하면 되고, 스키마를 바꿀 때는 `npm run db:generate` 로
마이그레이션을 만들어 커밋하세요.

### Cloudflare Tunnel

`~/.cloudflared/config.yml` 의 `ingress` 에 항목을 추가합니다. 더 구체적인 호스트가
먼저 와야 하고, `http_status:404` 폴백은 항상 마지막에 둡니다.

```yaml
ingress:
  - hostname: piano.pingulee.dev
    service: http://127.0.0.1:3000
  # ... 기존 항목들 ...
  - service: http_status:404
```

DNS 레코드를 만들고 터널을 재시작합니다.

```bash
cloudflared tunnel route dns <터널ID> piano.pingulee.dev
brew services restart cloudflared   # 또는 실행 중인 프로세스 재시작
```

### OAuth 리디렉션 URI

각 콘솔에 아래 주소를 등록해야 로그인이 동작합니다. 도메인이 바뀌면 여기도 함께
바꿔야 합니다.

- Google Cloud Console → 사용자 인증 정보 → OAuth 클라이언트
  `https://piano.pingulee.dev/api/auth/callback/google`
- Discord Developer Portal → OAuth2 → Redirects
  `https://piano.pingulee.dev/api/auth/callback/discord`

### 인스턴스를 늘릴 때

접속자 명단과 브로드캐스트가 프로세스 메모리에 있고, 로그인 정보는 로컬 SQLite 에
있습니다. 서버를 2대 이상으로 늘리려면 socket.io 어댑터(Redis 등)를 붙이고
데이터베이스를 공유형으로 바꿔야 합니다. 그 전에는 1대로 유지하세요.

## 지연에 대해

합주 품질은 네트워크 왕복 시간에 직접 좌우됩니다. 같은 지역(예: 서울) 사용자끼리는
보통 10-30ms 로 문제가 없지만, 대륙을 넘으면 150-250ms 가 걸려 합을 맞추기 어렵습니다.
이건 구현으로 줄일 수 없는 물리적 한계이므로, 서버 리전은 주 사용자와 가까운 곳에 두세요.
