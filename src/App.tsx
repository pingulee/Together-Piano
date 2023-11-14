import React from 'react';
import PianoKey from './components/PianoKey';

const App: React.FC = () => {
  return (
    <div>
      <PianoKey note="C" isBlack={false} />
      <PianoKey note="Db" isBlack={true} />
      <PianoKey note="D" isBlack={false} />
      <PianoKey note="Eb" isBlack={true} />
      <PianoKey note="E" isBlack={false} />
      <PianoKey note="F" isBlack={false} />
      <PianoKey note="Gb" isBlack={true} />
      <PianoKey note="G" isBlack={false} />
      <PianoKey note="Ab" isBlack={true} />
      <PianoKey note="A" isBlack={false} />
      <PianoKey note="Bb" isBlack={true} />
      <PianoKey note="B" isBlack={false} />
    </div>
  );
};

export default App;
