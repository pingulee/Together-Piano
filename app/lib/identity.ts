import {
  PARTICIPANT_COLORS,
  isParticipantColor,
} from '@/shared/participant-colors';

/**
 * 내 닉네임과 색.
 *
 * 로그인 여부와 무관하게 참가자가 직접 정합니다. 브라우저에 저장해 두므로
 * 다시 들어와도 같은 이름·색으로 보이고, 로그인하지 않아도 남에게 구분됩니다.
 *
 * React 상태가 아니라 외부 저장소로 다룹니다. `useState` + `useEffect` 로
 * localStorage 를 읽으면 서버 렌더 결과와 첫 클라이언트 렌더가 어긋나
 * 하이드레이션 경고가 나고, 이펙트에서 상태를 쓰는 안티패턴이 됩니다.
 * `useSyncExternalStore` 는 서버 스냅샷을 따로 받도록 만들어진 API 라
 * 이 경우에 정확히 맞고, 다른 탭에서 바꾼 값까지 따라옵니다.
 */

const STORAGE_KEY = 'together-piano:identity';

/** 서버 검증과 같은 값이어야 합니다. */
export const MAX_NAME_LENGTH = 24;

export interface Identity {
  name: string;
  color: string;
}

/**
 * 서버 렌더용 스냅샷.
 *
 * 모듈 상수라 참조가 고정입니다. `useSyncExternalStore` 는 스냅샷을 참조로
 * 비교하므로 매번 새 객체를 돌려주면 무한 렌더가 됩니다.
 */
const SERVER_IDENTITY: Identity = { name: '연주자', color: '#4cb2f5' };

const listeners = new Set<() => void>();

/** 마지막으로 읽은 값. 스냅샷 참조를 고정하기 위해 캐시합니다. */
let cached: Identity | null = null;

/**
 * 참가자가 직접 고른 값인지.
 *
 * 처음 만든 무작위 이름도 저장하므로(새로고침마다 바뀌면 안 됨) 저장 여부만으로는
 * 구분할 수 없습니다. 로그인 이름을 기본값으로 덮어써도 되는지 판단하는 데 씁니다.
 */
let chosen = false;

function randomName(): string {
  return `연주자 ${Math.floor(1000 + Math.random() * 9000)}`;
}

function randomColor(): string {
  const index = Math.floor(Math.random() * PARTICIPANT_COLORS.length);
  return PARTICIPANT_COLORS[index];
}

export function normalizeName(input: string): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
}

interface StoredIdentity extends Identity {
  chosen: boolean;
}

function read(): Identity {
  // 시크릿 모드나 저장소 차단 설정에서는 접근 자체가 예외를 던집니다.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const stored = parsed as Partial<StoredIdentity>;
        const safeName =
          typeof stored.name === 'string' ? normalizeName(stored.name) : '';
        if (safeName) {
          chosen = stored.chosen === true;
          return {
            name: safeName,
            color: isParticipantColor(stored.color)
              ? stored.color
              : randomColor(),
          };
        }
      }
    }
  } catch {
    // 읽을 수 없으면 이번 세션용 값을 새로 만듭니다.
  }

  chosen = false;
  return { name: randomName(), color: randomColor() };
}

function write(identity: Identity): void {
  try {
    const payload: StoredIdentity = { ...identity, chosen };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 저장에 실패해도 이번 세션에서는 정상 동작해야 합니다.
  }
}

export function getIdentity(): Identity {
  if (!cached) {
    cached = read();
    // 처음 만든 값도 저장해, 새로고침할 때마다 이름이 바뀌지 않게 합니다.
    write(cached);
  }
  return cached;
}

export function getServerIdentity(): Identity {
  return SERVER_IDENTITY;
}

/**
 * 닉네임·색을 바꿉니다.
 *
 * @param next 바꿀 항목만 넘깁니다.
 * @param options `seed: true` 면 로그인 이름 같은 자동 채움이므로 '직접 고름'으로
 *   기록하지 않습니다. 그래야 다음에 다른 계정으로 로그인해도 다시 채워집니다.
 */
export function setIdentity(
  next: Partial<Identity>,
  options: { seed?: boolean } = {},
): void {
  const current = getIdentity();
  const merged: Identity = {
    name: next.name === undefined ? current.name : normalizeName(next.name),
    color: isParticipantColor(next.color) ? next.color : current.color,
  };

  // 이름을 전부 지운 경우까지 저장하면 서버가 접속을 거절합니다.
  if (!merged.name) merged.name = current.name;

  if (merged.name === current.name && merged.color === current.color) return;

  if (!options.seed) chosen = true;
  cached = merged;
  write(merged);
  for (const listener of listeners) listener();
}

/** 참가자가 직접 닉네임·색을 정했는지 */
export function hasChosenIdentity(): boolean {
  // 캐시를 채우면서 저장된 플래그도 함께 읽어 옵니다.
  getIdentity();
  return chosen;
}

export function subscribeIdentity(listener: () => void): () => void {
  listeners.add(listener);

  // 다른 탭에서 바꾼 값도 따라갑니다.
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cached = null;
    listener();
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}
