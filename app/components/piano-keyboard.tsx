'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import PianoKey from '@/app/components/piano-key';
import {
  MAX_BASE_OCTAVE,
  MIN_BASE_OCTAVE,
  OCTAVE_DOWN_KEYS,
  OCTAVE_UP_KEYS,
  SUSTAIN_KEYS,
  keyToMidi,
  shortcutsForOctave,
} from '@/app/lib/keyboard-map';
import {
  BLACK_KEYS,
  KEY_GEOMETRY,
  WHITE_KEYS,
  isOctaveMarker,
  midiNoteToName,
} from '@/app/lib/notes';
import type { NoteName } from '@/shared/socket-events';

/** MIDI 상태 바이트 */
const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;
const MIDI_CONTROL_CHANGE = 0xb0;
const MIDI_STATUS_MASK = 0xf0;
const MIDI_SUSTAIN_CONTROLLER = 64;
const MIDI_MAX_VELOCITY = 127;
/** 컨트롤 값이 이 이상이면 페달을 밟은 것으로 봅니다. */
const MIDI_PEDAL_THRESHOLD = 64;

/** 마우스·터치로 누를 때 쓸 세기. 실제 압력을 알 수 없으므로 고정합니다. */
const POINTER_VELOCITY = 0.78;
/** 컴퓨터 키보드도 세기를 알 수 없어 조금 부드럽게 둡니다. */
const KEYBOARD_VELOCITY = 0.72;

interface PianoKeyboardProps {
  activeKeyColors: Map<NoteName, string>;
  baseOctave: number;
  showLabels: boolean;
  onBaseOctaveChange: (octave: number) => void;
  onPressNote: (note: NoteName, velocity?: number) => void;
  onReleaseNote: (note: NoteName) => void;
  onSustain: (down: boolean) => void;
}

/** 채팅 입력 중에는 연주 키 입력을 받지 않아야 합니다. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export default function PianoKeyboard({
  activeKeyColors,
  baseOctave,
  showLabels,
  onBaseOctaveChange,
  onPressNote,
  onReleaseNote,
  onSustain,
}: PianoKeyboardProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  /** 포인터로 누르고 있는 음. 드래그로 옮겨 다닐 수 있어 하나만 추적합니다. */
  const pointerNote = useRef<NoteName | null>(null);
  /** 컴퓨터 키보드로 눌린 음. 키 반복으로 다시 트리거되지 않게 합니다. */
  const keyboardNotes = useRef(new Map<string, NoteName>());

  const shortcuts = useMemo(
    () => shortcutsForOctave(baseOctave, midiNoteToName),
    [baseOctave],
  );

  /** 좌표 아래에 있는 건반을 찾습니다. 검은건반이 위에 있으므로 그쪽이 먼저 잡힙니다. */
  const noteAtPoint = useCallback((x: number, y: number): NoteName | null => {
    const element = document.elementFromPoint(x, y);
    const key = element?.closest<HTMLElement>('[data-note]');
    return key?.dataset.note ?? null;
  }, []);

  const movePointerTo = useCallback(
    (note: NoteName | null) => {
      if (pointerNote.current === note) return;

      if (pointerNote.current) onReleaseNote(pointerNote.current);
      pointerNote.current = note;
      if (note) onPressNote(note, POINTER_VELOCITY);
    },
    [onPressNote, onReleaseNote],
  );

  // --- 포인터 (마우스·터치·펜) ---------------------------------------------
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    /**
     * 드래그 중 히트 테스트는 프레임당 한 번만 합니다.
     *
     * `elementFromPoint` 는 최신 레이아웃을 요구하므로 부를 때마다 레이아웃이
     * 강제로 계산됩니다. 고주기 마우스는 초당 수백 개의 pointermove 를 쏘아
     * 이동마다 부르면 그만큼 레이아웃이 반복됩니다.
     */
    let queuedX = 0;
    let queuedY = 0;
    let frame = 0;

    const resolveQueued = () => {
      frame = 0;
      if (pointerNote.current === null) return;
      movePointerTo(noteAtPoint(queuedX, queuedY));
    };

    const handleDown = (event: PointerEvent) => {
      // 주 버튼만 받습니다. 오른쪽 클릭으로 소리가 나면 곤란합니다.
      if (event.button !== 0) return;
      event.preventDefault();
      movePointerTo(noteAtPoint(event.clientX, event.clientY));
    };

    // 누른 채로 옮기면 이어서 연주됩니다. (글리산도)
    const handleMove = (event: PointerEvent) => {
      if (pointerNote.current === null) return;
      queuedX = event.clientX;
      queuedY = event.clientY;
      if (frame === 0) frame = requestAnimationFrame(resolveQueued);
    };

    const handleUp = () => movePointerTo(null);

    deck.addEventListener('pointerdown', handleDown);
    // 건반 밖에서 떼는 경우까지 잡으려면 창 전체에서 들어야 합니다.
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);

    return () => {
      deck.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      if (frame !== 0) cancelAnimationFrame(frame);
      movePointerTo(null);
    };
  }, [movePointerTo, noteAtPoint]);

  // --- 컴퓨터 키보드 -------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const lowerKey = event.key.toLowerCase();

      if (SUSTAIN_KEYS.has(lowerKey)) {
        // 스페이스는 기본 동작이 스크롤이므로 막아야 합니다.
        event.preventDefault();
        if (!event.repeat) onSustain(true);
        return;
      }

      if (OCTAVE_DOWN_KEYS.has(lowerKey)) {
        event.preventDefault();
        onBaseOctaveChange(Math.max(baseOctave - 1, MIN_BASE_OCTAVE));
        return;
      }

      if (OCTAVE_UP_KEYS.has(lowerKey)) {
        event.preventDefault();
        onBaseOctaveChange(Math.min(baseOctave + 1, MAX_BASE_OCTAVE));
        return;
      }

      // 키를 누르고 있으면 keydown 이 반복되지만 음은 한 번만 시작해야 합니다.
      if (event.repeat || keyboardNotes.current.has(event.code)) return;

      const midi = keyToMidi(event.code, event.key, baseOctave);
      if (midi === null) return;

      const note = midiNoteToName(midi);
      if (!note) return;

      event.preventDefault();
      keyboardNotes.current.set(event.code, note);
      onPressNote(note, KEYBOARD_VELOCITY);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const lowerKey = event.key.toLowerCase();
      if (SUSTAIN_KEYS.has(lowerKey)) {
        onSustain(false);
        return;
      }

      const note = keyboardNotes.current.get(event.code);
      if (!note) return;

      keyboardNotes.current.delete(event.code);
      onReleaseNote(note);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [baseOctave, onBaseOctaveChange, onPressNote, onReleaseNote, onSustain]);

  // --- MIDI 건반 -----------------------------------------------------------
  useEffect(() => {
    if (!navigator.requestMIDIAccess) return;

    let inputs: MIDIInputMap | null = null;

    const handleMidiMessage = (event: MIDIMessageEvent) => {
      const data = event.data;
      if (!data || data.length < 3) return;

      const [status, first, second] = data;
      const command = status & MIDI_STATUS_MASK;

      if (
        command === MIDI_CONTROL_CHANGE &&
        first === MIDI_SUSTAIN_CONTROLLER
      ) {
        onSustain(second >= MIDI_PEDAL_THRESHOLD);
        return;
      }

      const note = midiNoteToName(first);
      if (!note) return;

      // velocity 0 인 note on 은 note off 와 같은 뜻입니다.
      if (command === MIDI_NOTE_ON && second > 0) {
        onPressNote(note, second / MIDI_MAX_VELOCITY);
        return;
      }

      if (command === MIDI_NOTE_OFF || command === MIDI_NOTE_ON) {
        onReleaseNote(note);
      }
    };

    navigator.requestMIDIAccess().then(
      (access) => {
        inputs = access.inputs;
        for (const input of inputs.values()) {
          input.onmidimessage = handleMidiMessage;
        }
      },
      () => {
        // 장치가 없거나 권한이 거부된 경우입니다. 다른 입력 수단은 그대로 됩니다.
      },
    );

    return () => {
      if (!inputs) return;
      for (const input of inputs.values()) input.onmidimessage = null;
    };
  }, [onPressNote, onReleaseNote, onSustain]);

  return (
    <div
      ref={deckRef}
      className='piano-cursor relative h-full w-full select-none'
      // 드래그 연주 중 페이지가 스크롤되거나 텍스트가 선택되지 않게 합니다.
      style={{ touchAction: 'none' }}
    >
      {WHITE_KEYS.map((keyDef) => (
        <PianoKey
          key={keyDef.note}
          keyDef={keyDef}
          geometry={KEY_GEOMETRY.get(keyDef.note)!}
          activeColor={activeKeyColors.get(keyDef.note) ?? null}
          shortcut={shortcuts.get(keyDef.note) ?? null}
          showLabel={showLabels}
          isOctaveMarker={isOctaveMarker(keyDef)}
        />
      ))}

      {BLACK_KEYS.map((keyDef) => (
        <PianoKey
          key={keyDef.note}
          keyDef={keyDef}
          geometry={KEY_GEOMETRY.get(keyDef.note)!}
          activeColor={activeKeyColors.get(keyDef.note) ?? null}
          shortcut={shortcuts.get(keyDef.note) ?? null}
          showLabel={showLabels}
          isOctaveMarker={false}
        />
      ))}
    </div>
  );
}
