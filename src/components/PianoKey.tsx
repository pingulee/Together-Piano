import React, { useState, useEffect } from 'react';
import '../styles/PianoKey.css';

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, isBlack }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleMouseDown);
    window.addEventListener('keyup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleMouseDown);
      window.removeEventListener('keyup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className={`piano-key ${isBlack ? 'black-key' : 'white-key'} ${isPressed ? 'pressed' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {note}
    </div>
  );
};

export default PianoKey;