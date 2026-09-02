import type { NoteName } from '@/shared/socket-events';

/**
 * Web Audio 기반 샘플러.
 *
 * `new Audio(...).play()` 는 호출마다 엘리먼트를 만들고 네트워크/디코드를 다시 거치므로
 * 타건에서 소리까지 수십 ms 가 밀리고, 같은 음을 빠르게 연타하면 서로 끊깁니다.
 * 여기서는 음원을 한 번만 디코드해 AudioBuffer 로 캐시하고, 재생마다 가벼운
 * BufferSource 만 새로 만들어 지연을 없애고 소리가 겹쳐 울리도록 합니다.
 */

const SAMPLE_PATH = (note: NoteName) => `/sounds/${note}.mp3`;

let audioContext: AudioContext | null = null;
const buffers = new Map<NoteName, AudioBuffer>();
const pending = new Map<NoteName, Promise<AudioBuffer | null>>();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  audioContext ??= new AudioContext();
  return audioContext;
}

async function loadBuffer(
  context: AudioContext,
  note: NoteName,
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(SAMPLE_PATH(note));
    if (!response.ok) return null;

    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    buffers.set(note, buffer);
    return buffer;
  } catch {
    // 없는 음원이나 네트워크 오류로 한 음이 안 나는 것은 치명적이지 않습니다.
    return null;
  } finally {
    pending.delete(note);
  }
}

function start(context: AudioContext, buffer: AudioBuffer): void {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
}

/**
 * 음 하나를 재생합니다.
 *
 * 이미 디코드된 음은 즉시(같은 tick 안에) 울리고, 처음 누른 음만 로드를 기다립니다.
 */
export function playNote(note: NoteName): void {
  const context = getAudioContext();
  if (!context) return;

  // 자동재생 정책으로 정지 상태일 수 있으므로, 사용자 조작 시점에 깨웁니다.
  if (context.state === 'suspended') void context.resume();

  const cached = buffers.get(note);
  if (cached) {
    start(context, cached);
    return;
  }

  const load = pending.get(note) ?? loadBuffer(context, note);
  pending.set(note, load);
  void load.then((buffer) => {
    if (buffer) start(context, buffer);
  });
}

/**
 * 자주 쓰는 음역을 미리 디코드해 첫 타건 지연을 없앱니다.
 * 사용자 조작이 없어도 안전하며, 실패해도 재생 시 다시 시도합니다.
 */
export function preloadNotes(notes: readonly NoteName[]): void {
  const context = getAudioContext();
  if (!context) return;

  for (const note of notes) {
    if (buffers.has(note) || pending.has(note)) continue;
    pending.set(note, loadBuffer(context, note));
  }
}
