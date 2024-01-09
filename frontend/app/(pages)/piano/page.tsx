'use client';
import ChatComponent from '@/app/components/Chat/ChatComponent';

type PianoKey = {
  color: 'white' | 'black';
  keyNumber: number;
};

export default function PianoPage(): string {
  let keys: PianoKey[] = [];
  let keyNumber = 1;
  let isBlackKeyNext = true;

  while (keyNumber <= 88) {
    keys.push({ color: 'white', keyNumber: keyNumber++ });

    // Determine if a black key should be added next
    if (
      isBlackKeyNext &&
      keyNumber % 88 !== 0 &&
      keyNumber % 88 !== 3 &&
      keyNumber % 88 !== 4 &&
      keyNumber % 88 !== 7 &&
      keyNumber % 88 !== 8 &&
      keyNumber % 88 !== 11
    ) {
      keys.push({ color: 'black', keyNumber: keyNumber++ });
    }

    // Toggle the flag for the next black key based on the pattern
    isBlackKeyNext =
      !isBlackKeyNext || keyNumber % 88 === 4 || keyNumber % 88 === 11;
  }

  return keys
    .map(
      (key) => `<li className='${key.color}' data-key='${key.keyNumber}'></li>`,
    )
    .join('\n');
}
