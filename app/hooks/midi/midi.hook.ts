// src/hooks/useMIDI.ts

import { useEffect } from 'react';
import {
  onMIDIFailure,
  onMIDISuccess,
} from '@/app/utils/midi/midi-to-note.util';

/**
 * MIDI 디바이스 접근 및 메시지 처리를 위한 훅
 */
export const useMIDI = () => {
  useEffect(() => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, []);
};
