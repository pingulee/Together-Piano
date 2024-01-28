import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Web MIDI API를 사용하여 MIDI 입력을 처리합니다.
    navigator.requestMIDIAccess().then((midiAccess) => {
      const inputs = midiAccess.inputs.values();

      for (const input of inputs) {
        input.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
          // MIDI 메시지를 처리하는 로직을 여기에 작성합니다.
          console.log('Received MIDI message:', event.data);
        };
      }
    });

    res.status(200).json({ message: 'MIDI 입력 처리가 시작되었습니다.' });
  } catch (error) {
    console.error('MIDI 입력 처리 중 오류 발생:', error);
    res.status(500).json({ error: 'MIDI 입력 처리 중 오류가 발생했습니다.' });
  }
}
