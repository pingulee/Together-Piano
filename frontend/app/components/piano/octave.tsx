import React from 'react';
import Key from './key';

export default function Octave({ pitch, sustain }) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const createKey = (n) =>
        <Key
            key={n + pitch}
            note={n + pitch}
            className={(n.length === 1) ? 'key' : 'key black'}
            sustain={sustain}
        />

    const createOctave = (pitch) => {
        // pitch 0 has only 3 notes: 'A0', 'A#0', 'B0'
        if (pitch === 0) return notes.slice(-3).map(n => createKey(n));
        // pitch 8 has only 1 note: 'C8'
        if (pitch === 8) return notes.slice(0, 1).map(n => createKey(n));
        // all other pitches include all notes
        return notes.map(n => createKey(n));
    }

    return (
        <ul className="octave">
            {createOctave(pitch)}
        </ul>
    )
}