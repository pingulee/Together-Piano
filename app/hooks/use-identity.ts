'use client';

import { useSyncExternalStore } from 'react';

import {
  getIdentity,
  getServerIdentity,
  subscribeIdentity,
  type Identity,
} from '@/app/lib/identity';

/**
 * 저장된 내 닉네임·색을 읽습니다.
 *
 * 값을 바꿀 때는 `setIdentity` 를 직접 부르면 됩니다. 세터를 훅에서 돌려주지
 * 않는 이유는, 저장소가 모듈 하나이므로 어느 컴포넌트에서 바꿔도 이 훅을 쓰는
 * 모든 곳이 함께 갱신되기 때문입니다.
 */
export function useIdentity(): Identity {
  return useSyncExternalStore(
    subscribeIdentity,
    getIdentity,
    getServerIdentity,
  );
}
