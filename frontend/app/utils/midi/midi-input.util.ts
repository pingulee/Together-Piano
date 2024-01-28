import { useEffect } from 'react';

export default function handleMidiInput(
  onMidiMessage: (data: Uint8Array) => void,
) {
  navigator.requestMIDIAccess().then((midiAccess: WebMidi.MIDIAccess) => {
    const inputs = midiAccess.inputs.values();

    for (const input of inputs) {
      input.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
        // MIDI 메시지를 받아 처리하는 로직
        onMidiMessage(event.data);
      };
    }
  });
}
