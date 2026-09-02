# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 의존성 설치 (devDependencies 포함 - 빌드에 필요)
# better-sqlite3 는 네이티브 모듈이므로 빌드 도구가 필요할 수 있습니다.
# ---------------------------------------------------------------------------
FROM node:24-slim AS deps
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# 빌드
# ---------------------------------------------------------------------------
FROM node:24-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* 값은 빌드 시점에 정적으로 치환되므로 여기서 주입해야 합니다.
ARG NEXT_PUBLIC_SOCKET_URL=""
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
# auth 라우트가 빌드 중 평가되며 NEXTAUTH_SECRET 을 요구하므로 자리값을 넣습니다.
# 실제 값은 런타임에 주입되며, 이 자리값은 이미지에 남지 않습니다.
RUN NEXTAUTH_SECRET=build npm run build

# ---------------------------------------------------------------------------
# 런타임 (devDependencies 제외, 비루트 실행)
# ---------------------------------------------------------------------------
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATABASE_PATH=/data/app.db

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
 && apt-get purge -y python3 make g++ \
 && apt-get autoremove -y \
 && npm cache clean --force

COPY --from=build /app/.next ./.next
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/next.config.ts ./next.config.ts

# SQLite 파일을 담을 볼륨. 마운트하지 않으면 컨테이너와 함께 사라집니다.
RUN mkdir -p /data && chown node:node /data
VOLUME ["/data"]

USER node
EXPOSE 3000

# 프로세스 재시작은 컨테이너 런타임이 담당하므로 프로세스 매니저를 두지 않습니다.
# 신호를 그대로 받으려면 셸을 거치지 않는 exec 형식이어야 합니다.
CMD ["node", "dist/server/server.js"]
