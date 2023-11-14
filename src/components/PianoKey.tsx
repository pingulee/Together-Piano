import React, { useState, useEffect } from 'react';
import '../styles/PianoKey.css';

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, isBlack }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleKeyDown = () => {
    setIsPressed(true);
  };

  const handleKeyUp = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      className={`piano-key ${isBlack ? 'black-key' : 'white-key'} ${isPressed ? 'pressed' : ''}`}
    >
      {note}
    </div>
  );
};

export default PianoKey;