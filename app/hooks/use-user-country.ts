'use client';

import { useEffect, useState } from 'react';

import { GEOLOCATION_API_URL } from '@/app/lib/env';

interface GeolocationResponse {
  country_code?: string | null;
}

/**
 * 국기 표시에 쓸 ISO 3166-1 alpha-2 국가 코드(소문자)를 반환합니다.
 *
 * 외부 API 이므로 실패·지연을 전제로 하며, 실패 시 null 을 유지해
 * 국기만 표시되지 않고 나머지 기능은 그대로 동작합니다.
 */
export function useUserCountry(): string | null {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(GEOLOCATION_API_URL, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json()) as GeolocationResponse;
        if (data.country_code) setCountry(data.country_code.toLowerCase());
      } catch {
        // 국가 조회 실패는 치명적이지 않으므로 무시합니다.
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  return country;
}
