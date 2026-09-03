'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  noteOff as audioNoteOff,
  noteOn as audioNoteOn,
  preloadSamples,
  setSustain as audioSetSustain,
  stopSource,
  unlockAudio,
} from '@/app/lib/audio';
import { socket } from '@/app/lib/socket';
import {
  FALLBACK_PARTICIPANT_COLOR,
  colorForId,
} from '@/shared/participant-colors';
import type { NoteName, Participant } from '@/shared/socket-events';

/** 자기 연주를 가리키는 소스 id. 원격 참가자는 소켓 id 를 씁니다. */
export const LOCAL_SOURCE = 'local';

/** 뗀 리본이 떠올라 사라지는 데 걸리는 시간. globals.css 의 애니메이션과 맞춥니다. */
const RIBBON_EXIT_MS = 900;

/** 화면에 남겨 둘 리본 최대 개수. 빠르게 연주해도 무한히 쌓이지 않게 합니다. */
const MAX_RIBBONS = 96;

export interface Ribbon {
  key: string;
  note: NoteName;
  color: string;
  /** performance.now() 기준. 누르고 있는 동안 높이를 계산하는 데 씁니다. */
  startedAt: number;
  released: boolean;
}

interface KeyHolder {
  sourceId: string;
  color: string;
}

/**
 * 피아노 방의 상태를 한곳에서 관리합니다.
 *
 * 로컬 입력과 소켓으로 들어온 원격 입력이 모두 이 훅을 거쳐 소리·건반 강조·리본으로
 * 이어집니다. 입력 경로마다 따로 처리하면 소리와 화면이 어긋나기 쉽습니다.
 */
export function usePianoSession() {
  const [self, setSelf] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [heldKeys, setHeldKeys] = useState<Map<NoteName, KeyHolder[]>>(
    () => new Map(),
  );
  const [ribbons, setRibbons] = useState<Ribbon[]>([]);
  const [sustainDown, setSustainDown] = useState(false);

  /** `소스:음` -> 리본 key. 뗄 때 어느 리본을 끝낼지 찾습니다. */
  const ribbonIndex = useRef(new Map<string, string>());
  const ribbonCounter = useRef(0);
  const exitTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const selfColor = self?.color ?? FALLBACK_PARTICIPANT_COLOR;

  // 음원을 배경에서 미리 받아 둡니다.
  useEffect(() => {
    preloadSamples();
  }, []);

  const spawnRibbon = useCallback(
    (sourceId: string, note: NoteName, color: string) => {
      ribbonCounter.current += 1;
      const key = `${sourceId}:${note}:${ribbonCounter.current}`;
      ribbonIndex.current.set(`${sourceId}:${note}`, key);

      setRibbons((prev) => {
        const next = [
          ...prev,
          { key, note, color, startedAt: performance.now(), released: false },
        ];
        return next.length > MAX_RIBBONS ? next.slice(-MAX_RIBBONS) : next;
      });
    },
    [],
  );

  const releaseRibbon = useCallback((sourceId: string, note: NoteName) => {
    const indexKey = `${sourceId}:${note}`;
    const key = ribbonIndex.current.get(indexKey);
    if (!key) return;
    ribbonIndex.current.delete(indexKey);

    setRibbons((prev) =>
      prev.map((ribbon) =>
        ribbon.key === key ? { ...ribbon, released: true } : ribbon,
      ),
    );

    const timer = setTimeout(() => {
      exitTimers.current.delete(key);
      setRibbons((prev) => prev.filter((ribbon) => ribbon.key !== key));
    }, RIBBON_EXIT_MS);
    exitTimers.current.set(key, timer);
  }, []);

  const addHolder = useCallback((note: NoteName, holder: KeyHolder) => {
    setHeldKeys((prev) => {
      const next = new Map(prev);
      const holders = next.get(note) ?? [];
      next.set(note, [
        ...holders.filter((entry) => entry.sourceId !== holder.sourceId),
        holder,
      ]);
      return next;
    });
  }, []);

  const removeHolder = useCallback((note: NoteName, sourceId: string) => {
    setHeldKeys((prev) => {
      const holders = prev.get(note);
      if (!holders) return prev;

      const remaining = holders.filter((entry) => entry.sourceId !== sourceId);
      const next = new Map(prev);
      if (remaining.length === 0) next.delete(note);
      else next.set(note, remaining);
      return next;
    });
  }, []);

  const beginNote = useCallback(
    (sourceId: string, note: NoteName, velocity: number, color: string) => {
      audioNoteOn(sourceId, note, velocity);
      addHolder(note, { sourceId, color });
      spawnRibbon(sourceId, note, color);
    },
    [addHolder, spawnRibbon],
  );

  const endNote = useCallback(
    (sourceId: string, note: NoteName) => {
      audioNoteOff(sourceId, note);
      removeHolder(note, sourceId);
      releaseRibbon(sourceId, note);
    },
    [releaseRibbon, removeHolder],
  );

  // --- 로컬 입력 -----------------------------------------------------------

  const pressNote = useCallback(
    (note: NoteName, velocity = 0.78) => {
      unlockAudio();
      beginNote(LOCAL_SOURCE, note, velocity, selfColor);
      socket.emit('noteOn', note, velocity);
    },
    [beginNote, selfColor],
  );

  const releaseNote = useCallback(
    (note: NoteName) => {
      endNote(LOCAL_SOURCE, note);
      socket.emit('noteOff', note);
    },
    [endNote],
  );

  const pressSustain = useCallback((down: boolean) => {
    setSustainDown(down);
    audioSetSustain(LOCAL_SOURCE, down);
    socket.emit('sustain', down);
  }, []);

  // --- 소켓 수신 -----------------------------------------------------------

  useEffect(() => {
    const handleWelcome = (participant: Participant) => setSelf(participant);

    const handleParticipants = (next: Participant[]) => {
      setParticipants((previous) => {
        // 사라진 참가자의 소리가 계속 울리지 않도록 정리합니다.
        const nextIds = new Set(next.map((entry) => entry.id));
        for (const entry of previous) {
          if (!nextIds.has(entry.id)) stopSource(entry.id);
        }
        return next;
      });
    };

    const handleNoteOn = (note: NoteName, velocity: number, from: string) => {
      beginNote(from, note, velocity, colorForId(from));
    };

    const handleNoteOff = (note: NoteName, from: string) => {
      endNote(from, note);
    };

    const handleSustain = (down: boolean, from: string) => {
      audioSetSustain(from, down);
    };

    socket.on('welcome', handleWelcome);
    socket.on('participants', handleParticipants);
    socket.on('noteOn', handleNoteOn);
    socket.on('noteOff', handleNoteOff);
    socket.on('sustain', handleSustain);

    return () => {
      socket.off('welcome', handleWelcome);
      socket.off('participants', handleParticipants);
      socket.off('noteOn', handleNoteOn);
      socket.off('noteOff', handleNoteOff);
      socket.off('sustain', handleSustain);
    };
  }, [beginNote, endNote]);

  /**
   * blur 처리에 필요한 최신 값을 ref 로 들고 갑니다.
   *
   * 이 값들을 이펙트 의존성에 그대로 넣으면 음을 누를 때마다 리스너를 떼고
   * 다시 붙이게 됩니다. 리스너는 한 번만 등록되면 됩니다.
   */
  const latest = useRef({ heldKeys, sustainDown, endNote, pressSustain });
  useEffect(() => {
    latest.current = { heldKeys, sustainDown, endNote, pressSustain };
  }, [endNote, heldKeys, pressSustain, sustainDown]);

  // 창에서 포커스가 빠지면 keyup 을 못 받아 음이 계속 울립니다.
  useEffect(() => {
    const releaseEverything = () => {
      const current = latest.current;

      for (const [note, holders] of current.heldKeys) {
        if (holders.some((holder) => holder.sourceId === LOCAL_SOURCE)) {
          current.endNote(LOCAL_SOURCE, note);
          socket.emit('noteOff', note);
        }
      }

      if (current.sustainDown) current.pressSustain(false);
    };

    window.addEventListener('blur', releaseEverything);
    return () => window.removeEventListener('blur', releaseEverything);
  }, []);

  useEffect(() => {
    const timers = exitTimers.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  /** 음 -> 표시할 색. 여러 명이 같은 음을 누르면 가장 마지막 사람의 색을 씁니다. */
  const activeKeyColors = useMemo(() => {
    const colors = new Map<NoteName, string>();
    for (const [note, holders] of heldKeys) {
      const last = holders.at(-1);
      if (last) colors.set(note, last.color);
    }
    return colors;
  }, [heldKeys]);

  return {
    self,
    participants,
    activeKeyColors,
    ribbons,
    sustainDown,
    pressNote,
    releaseNote,
    pressSustain,
  };
}
