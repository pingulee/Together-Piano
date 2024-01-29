'use client';
import React, { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import PianoOctave from './piano-octave.component';

export default function PianoContainer() {


  const pitchNum = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className='flex flex-col w-full justify-center'>
      <div
        className='flex w-full h-1/5 piano-cursor '
      >
        {pitchNum.map((n) => (
          <PianoOctave key={n} pitch={n} />
        ))}
      </div>
    </div>
  );
}
