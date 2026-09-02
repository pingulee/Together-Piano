import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 이펙트 정리 누락을 개발 중에 드러내기 위해 켜 둡니다.
  reactStrictMode: true,
  images: {
    // 커스텀 서버/자가 호스팅에서도 그대로 동작하도록 최적화 파이프라인을 끕니다.
    unoptimized: true,
  },
  // better-sqlite3 는 네이티브 바이너리를 포함하므로 번들 대신 런타임에 require 합니다.
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
