import React from 'react';
import Octave from './octave';

export default function Keyboard({ sustain }) {
  const pitchNum = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className='flex justify-center bg-[rgb(20,20,20)] py-5 px-0 overflow-auto w-[1920px] mx-auto'>
      {pitchNum.map((n) => (
        <Octave key={n} pitch={n} sustain={sustain} />
      ))}
    </div>
  );
}
