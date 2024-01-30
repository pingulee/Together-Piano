'use client';
import React, { useEffect, useState } from 'react';

import PianoOctave from './piano-octave.component';

export default function Piano() {
  const pitchNum = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <>
      <div className='flex w-full h-1/5 piano-cursor'>
        {pitchNum.map((n) => (
          <PianoOctave key={n} pitch={n} />
        ))}
      </div>
    </>
  );
}
