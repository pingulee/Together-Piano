import { MIDI_BY_NOTE, SAMPLE_NOTES, chooseSample } from '@/app/lib/notes';
import type { NoteName } from '@/shared/socket-events';

/**
 * 피아노 사운드 엔진.
 *
 * 이전 구현은 타건마다 `new Audio().play()` 를 호출했습니다. 그러면 호출마다
 * 엘리먼트를 만들고 디코드를 다시 거쳐 소리가 수십 ms 밀리고, 건반을 떼도
 * 샘플이 끝까지 울리고, 같은 음을 연타하면 서로 끊깁니다.
 *
 * 여기서는 실제 악기처럼 동작하도록 다음을 갖춥니다.
 *
 * - 샘플은 단3도 간격 30개만 받고 사이 음은 재생 속도로 피치를 옮깁니다.
 *   (`chooseSample` 참고) 전체를 받는 것보다 데이터가 1/3 이고 첫 소리도 빠릅니다.
 * - 디코드한 AudioBuffer 를 캐시하고, 재생마다 가벼운 BufferSource 만 만듭니다.
 * - 건반을 뗄 때 릴리즈 엔벨로프로 감쇠시켜 댐퍼가 내려앉는 느낌을 냅니다.
 * - 서스테인 페달을 누르면 뗀 음을 붙잡아 둡니다.
 * - 벨로시티에 따라 음량이 달라집니다.
 * - 알고리즘 리버브를 섞어 마른 샘플이 그대로 튀지 않게 합니다.
 * - 마스터에 컴프레서를 걸어 화음이 쌓일 때 클리핑을 막습니다.
 * - 보이스를 `참가자:음` 으로 구분해, 두 사람이 같은 음을 눌러도 서로의
 *   소리를 끊지 않습니다.
 */

/** 타건 직후 음량이 올라가는 시간. 너무 짧으면 클릭 노이즈가 납니다. */
const ATTACK_SECONDS = 0.004;
/** 건반을 뗀 뒤 감쇠 시간 */
const RELEASE_SECONDS = 0.36;
/** 같은 음을 다시 누를 때 이전 보이스를 지우는 시간 */
const RETRIGGER_SECONDS = 0.03;
/** 지수 감쇠는 0 에 닿을 수 없으므로 사실상 무음인 값으로 내립니다. */
const SILENCE = 0.0001;

const REVERB_SECONDS = 2.4;
const REVERB_DECAY = 2.6;
/** 리버브 비율. 피아노는 과하면 탁해지므로 낮게 둡니다. */
const REVERB_MIX = 0.2;

/** 동시 다운로드 수. 한꺼번에 요청하면 첫 타건이 오히려 늦어집니다. */
const MAX_CONCURRENT_LOADS = 6;

/** 우선순위 기준. 가운데 도에서 가까운 샘플을 먼저 받습니다. */
const MIDDLE_C_MIDI = 60;

/** 방금 누른 음이 이 시간 안에 도착하지 않으면 재생을 포기합니다. */
const LATE_SAMPLE_CUTOFF_SECONDS = 1;

interface Voice {
  source: AudioBufferSourceNode;
  gain: GainNode;
  /** 서스테인 때문에 릴리즈를 미뤄 둔 상태 */
  awaitingSustain: boolean;
}

interface Engine {
  context: AudioContext;
  master: GainNode;
  dry: GainNode;
  reverbSend: GainNode;
}

export interface LoadProgress {
  loaded: number;
  total: number;
}

let engine: Engine | null = null;

const buffers = new Map<NoteName, AudioBuffer>();
const loading = new Map<NoteName, Promise<AudioBuffer | null>>();
const pendingQueue: NoteName[] = [];
let activeLoads = 0;

const voices = new Map<string, Voice>();
const sustainedSources = new Set<string>();

const progressListeners = new Set<(progress: LoadProgress) => void>();

let masterVolume = 0.8;

function voiceKey(sourceId: string, note: NoteName): string {
  return `${sourceId}:${note}`;
}

function notifyProgress(): void {
  const progress: LoadProgress = {
    loaded: buffers.size,
    total: SAMPLE_NOTES.length,
  };
  for (const listener of progressListeners) listener(progress);
}

/** 샘플 로딩 진행 상황을 구독합니다. 반환값을 호출하면 구독이 해제됩니다. */
export function onLoadProgress(
  listener: (progress: LoadProgress) => void,
): () => void {
  progressListeners.add(listener);
  listener({ loaded: buffers.size, total: SAMPLE_NOTES.length });
  return () => progressListeners.delete(listener);
}

/**
 * 짧은 노이즈를 지수 감쇠시켜 임펄스 응답을 만듭니다.
 * 별도 음원 파일 없이 공간감을 얻는 방법입니다.
 */
function createImpulseResponse(context: AudioContext): AudioBuffer {
  const { sampleRate } = context;
  const length = Math.floor(sampleRate * REVERB_SECONDS);
  const impulse = context.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const progress = i / length;
      data[i] = (Math.random() * 2 - 1) * (1 - progress) ** REVERB_DECAY;
    }
  }

  return impulse;
}

function createEngine(): Engine | null {
  if (typeof window === 'undefined') return null;

  const context = new AudioContext({ latencyHint: 'interactive' });

  // 화음이 쌓여도 피크가 넘치지 않도록 마스터에 완만한 컴프레서를 둡니다.
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -12;
  compressor.knee.value = 24;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.25;
  compressor.connect(context.destination);

  const master = context.createGain();
  master.gain.value = masterVolume;
  master.connect(compressor);

  const dry = context.createGain();
  dry.gain.value = 1 - REVERB_MIX;
  dry.connect(master);

  const wet = context.createGain();
  wet.gain.value = REVERB_MIX;
  wet.connect(master);

  const convolver = context.createConvolver();
  convolver.buffer = createImpulseResponse(context);
  convolver.connect(wet);

  const reverbSend = context.createGain();
  reverbSend.gain.value = 1;
  reverbSend.connect(convolver);

  return { context, master, dry, reverbSend };
}

function getEngine(): Engine | null {
  engine ??= createEngine();
  return engine;
}

/**
 * 브라우저 자동재생 정책 때문에 오디오는 사용자 조작이 있은 뒤에야 소리가 납니다.
 * 첫 클릭·키 입력 시점에 호출하세요.
 */
export function unlockAudio(): void {
  const current = getEngine();
  if (current && current.context.state === 'suspended') {
    void current.context.resume();
  }
}

async function fetchSample(
  context: AudioContext,
  sample: NoteName,
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(`/sounds/${sample}.mp3`);
    if (!response.ok) return null;

    const decoded = await context.decodeAudioData(await response.arrayBuffer());
    buffers.set(sample, decoded);
    notifyProgress();
    return decoded;
  } catch {
    // 샘플 하나를 못 받아도 나머지 연주는 계속되어야 합니다.
    return null;
  } finally {
    loading.delete(sample);
    activeLoads -= 1;
    pumpQueue();
  }
}

function startLoad(sample: NoteName): Promise<AudioBuffer | null> {
  const current = getEngine();
  if (!current) return Promise.resolve(null);

  activeLoads += 1;
  const promise = fetchSample(current.context, sample);
  loading.set(sample, promise);
  return promise;
}

function pumpQueue(): void {
  while (activeLoads < MAX_CONCURRENT_LOADS && pendingQueue.length > 0) {
    const sample = pendingQueue.shift();
    if (!sample || buffers.has(sample) || loading.has(sample)) continue;
    void startLoad(sample);
  }
}

/** 이미 받았거나 받는 중이면 그 프로미스를, 아니면 대기열 맨 앞으로 올립니다. */
function requestSample(sample: NoteName): Promise<AudioBuffer | null> {
  const cached = buffers.get(sample);
  if (cached) return Promise.resolve(cached);

  const inFlight = loading.get(sample);
  if (inFlight) return inFlight;

  if (activeLoads < MAX_CONCURRENT_LOADS) return startLoad(sample);

  const queued = pendingQueue.indexOf(sample);
  if (queued >= 0) pendingQueue.splice(queued, 1);
  pendingQueue.unshift(sample);

  return new Promise((resolve) => {
    const poll = () => {
      const buffer = buffers.get(sample);
      if (buffer) {
        resolve(buffer);
        return;
      }
      const promise = loading.get(sample);
      if (promise) {
        void promise.then(resolve);
        return;
      }
      setTimeout(poll, 40);
    };
    poll();
  });
}

/**
 * 샘플 30개를 배경에서 받아 둡니다.
 * 가운데 도에서 가까운 순서로 받으므로 자주 쓰는 음역이 먼저 준비됩니다.
 */
export function preloadSamples(): void {
  if (!getEngine()) return;

  const byDistanceFromMiddle = SAMPLE_NOTES.toSorted((a, b) => {
    const distance = (note: NoteName) =>
      Math.abs((MIDI_BY_NOTE.get(note) ?? 0) - MIDDLE_C_MIDI);
    return distance(a) - distance(b);
  });

  for (const sample of byDistanceFromMiddle) {
    if (buffers.has(sample) || loading.has(sample)) continue;
    pendingQueue.push(sample);
  }

  pumpQueue();
}

function releaseVoice(
  voice: Voice,
  context: AudioContext,
  seconds: number,
): void {
  const { gain, source } = voice;
  const now = context.currentTime;

  gain.gain.cancelScheduledValues(now);
  // 현재 값에서 이어서 내려야 갑자기 튀지 않습니다.
  gain.gain.setValueAtTime(Math.max(gain.gain.value, SILENCE), now);
  gain.gain.exponentialRampToValueAtTime(SILENCE, now + seconds);

  try {
    source.stop(now + seconds);
  } catch {
    // 이미 정지된 소스입니다.
  }
}

function attachVoice(
  current: Engine,
  key: string,
  buffer: AudioBuffer,
  playbackRate: number,
  velocity: number,
): void {
  const { context, dry, reverbSend } = current;
  const now = context.currentTime;

  const gain = context.createGain();
  // 벨로시티를 그대로 쓰면 약하게 누른 음이 상대적으로 너무 크게 들립니다.
  const peak = Math.max(velocity, 0.05) ** 1.6;
  gain.gain.setValueAtTime(SILENCE, now);
  gain.gain.linearRampToValueAtTime(peak, now + ATTACK_SECONDS);
  gain.connect(dry);
  gain.connect(reverbSend);

  const source = context.createBufferSource();
  source.buffer = buffer;
  // 샘플과 목표 음의 반음 차이만큼 재생 속도를 바꿔 피치를 옮깁니다.
  source.playbackRate.value = playbackRate;
  source.connect(gain);
  source.start(now);

  const voice: Voice = { source, gain, awaitingSustain: false };
  // 재생이 끝나면 노드를 끊어 줍니다. 그대로 두면 그래프에 계속 매달려 있습니다.
  source.addEventListener(
    'ended',
    () => {
      if (voices.get(key) === voice) voices.delete(key);
      gain.disconnect();
    },
    { once: true },
  );

  voices.set(key, voice);
}

/**
 * 음을 누릅니다.
 *
 * @param sourceId 누른 주체. 자신은 `local`, 원격 참가자는 소켓 id 를 씁니다.
 * @param velocity 0~1
 */
export function noteOn(sourceId: string, note: NoteName, velocity = 0.8): void {
  const current = getEngine();
  if (!current) return;

  const choice = chooseSample(note);
  if (!choice) return;

  unlockAudio();

  const key = voiceKey(sourceId, note);

  // 같은 주체가 같은 음을 다시 누르면 이전 보이스를 빠르게 지웁니다.
  const existing = voices.get(key);
  if (existing) {
    releaseVoice(existing, current.context, RETRIGGER_SECONDS);
    voices.delete(key);
  }

  const cached = buffers.get(choice.sample);
  if (cached) {
    attachVoice(current, key, cached, choice.playbackRate, velocity);
    return;
  }

  // 아직 안 받은 샘플이면 도착하는 대로 재생하되, 너무 늦으면 버립니다.
  const requestedAt = current.context.currentTime;
  void requestSample(choice.sample).then((buffer) => {
    if (!buffer) return;
    const late =
      current.context.currentTime - requestedAt > LATE_SAMPLE_CUTOFF_SECONDS;
    if (late) return;
    attachVoice(current, key, buffer, choice.playbackRate, velocity);
  });
}

/** 음을 뗍니다. 서스테인이 걸려 있으면 페달을 뗄 때까지 붙잡아 둡니다. */
export function noteOff(sourceId: string, note: NoteName): void {
  const current = getEngine();
  if (!current) return;

  const key = voiceKey(sourceId, note);
  const voice = voices.get(key);
  if (!voice) return;

  if (sustainedSources.has(sourceId)) {
    voice.awaitingSustain = true;
    return;
  }

  releaseVoice(voice, current.context, RELEASE_SECONDS);
  voices.delete(key);
}

/** 서스테인 페달. 뗄 때 붙잡아 두었던 음을 한꺼번에 감쇠시킵니다. */
export function setSustain(sourceId: string, down: boolean): void {
  const current = getEngine();
  if (!current) return;

  if (down) {
    sustainedSources.add(sourceId);
    return;
  }

  sustainedSources.delete(sourceId);

  for (const [key, voice] of voices) {
    if (!key.startsWith(`${sourceId}:`) || !voice.awaitingSustain) continue;
    releaseVoice(voice, current.context, RELEASE_SECONDS);
    voices.delete(key);
  }
}

/** 한 주체의 모든 소리를 끕니다. 참가자가 나갈 때 호출합니다. */
export function stopSource(sourceId: string): void {
  const current = getEngine();
  if (!current) return;

  sustainedSources.delete(sourceId);

  for (const [key, voice] of voices) {
    if (!key.startsWith(`${sourceId}:`)) continue;
    releaseVoice(voice, current.context, RELEASE_SECONDS);
    voices.delete(key);
  }
}

export function getMasterVolume(): number {
  return masterVolume;
}

export function setMasterVolume(value: number): void {
  masterVolume = Math.min(Math.max(value, 0), 1);

  const current = getEngine();
  if (!current) return;

  const { context, master } = current;
  master.gain.setTargetAtTime(masterVolume, context.currentTime, 0.02);
}
