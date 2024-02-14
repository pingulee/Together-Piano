import React, { useEffect, useRef, useState } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

const PianoKey: React.FC<PianoKeyProps> = ({ className, note }) => {
  const noteMap = new Map<number, string>([
    [21, 'A0'],
    [22, 'AS0'],
    [23, 'B0'],
    [24, 'C1'],
    [25, 'CS1'],
    [26, 'D1'],
    [27, 'DS1'],
    [28, 'E1'],
    [29, 'F1'],
    [30, 'FS1'],
    [31, 'G1'],
    [32, 'GS1'],
    [33, 'A1'],
    [34, 'AS1'],
    [35, 'B1'],
    [36, 'C2'],
    [37, 'CS2'],
    [38, 'D2'],
    [39, 'DS2'],
    [40, 'E2'],
    [41, 'F2'],
    [42, 'FS2'],
    [43, 'G2'],
    [44, 'GS2'],
    [45, 'A2'],
    [46, 'AS2'],
    [47, 'B2'],
    [48, 'C3'],
    [49, 'CS3'],
    [50, 'D3'],
    [51, 'DS3'],
    [52, 'E3'],
    [53, 'F3'],
    [54, 'FS3'],
    [55, 'G3'],
    [56, 'GS3'],
    [57, 'A3'],
    [58, 'AS3'],
    [59, 'B3'],
    [60, 'C4'],
    [61, 'CS4'],
    [62, 'D4'],
    [63, 'DS4'],
    [64, 'E4'],
    [65, 'F4'],
    [66, 'FS4'],
    [67, 'G4'],
    [68, 'GS4'],
    [69, 'A4'],
    [70, 'AS4'],
    [71, 'B4'],
    [72, 'C5'],
    [73, 'CS5'],
    [74, 'D5'],
    [75, 'DS5'],
    [76, 'E5'],
    [77, 'F5'],
    [78, 'FS5'],
    [79, 'G5'],
    [80, 'GS5'],
    [81, 'A5'],
    [82, 'AS5'],
    [83, 'B5'],
    [84, 'C6'],
    [85, 'CS6'],
    [86, 'D6'],
    [87, 'DS6'],
    [88, 'E6'],
    [89, 'F6'],
    [90, 'FS6'],
    [91, 'G6'],
    [92, 'GS6'],
    [93, 'A6'],
    [94, 'AS6'],
    [95, 'B6'],
    [96, 'C7'],
    [97, 'CS7'],
    [98, 'D7'],
    [99, 'DS7'],
    [100, 'E7'],
    [101, 'F7'],
    [102, 'FS7'],
    [103, 'G7'],
    [104, 'GS7'],
    [105, 'A7'],
    [106, 'AS7'],
    [107, 'B7'],
    [108, 'C8'],
  ]);

  const playSound = (noteName: string) => {
    const audio = new Audio(`/sounds/${noteName}.mp3`); // 오디오 파일 경로 설정
    audio.play(); // 오디오 재생
    console.log(noteNam);
  };

  useEffect(() => {
    const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
      }
    };

    const onMIDIFailure = () => {
      console.warn('MIDI devices not accessible or not available.');
    };

    const getMIDIMessage = (midiMessage: WebMidi.MIDIMessageEvent) => {
      const command = midiMessage.data[0];
      const midiNote = midiMessage.data[1];
      const velocity = midiMessage.data.length > 2 ? midiMessage.data[2] : 0;

      if (command === 144 && velocity > 0) {
        const noteName = noteMap.get(midiNote);
        if (noteName) {
          playSound(noteName);
        }
      }
    };

    if ('requestMIDIAccess' in navigator) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.warn('This browser does not support Web MIDI API.');
    }
  }, [noteMap, playSound]);

  return <div className={className} onMouseDown={() => playSound(note)} />;
};

export default PianoKey;
