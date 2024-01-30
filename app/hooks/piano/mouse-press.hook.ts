import { useState } from 'react';

const useKeyPress = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return {
    isPressed,
    handleMouseDown,
    handleMouseUp,
  };
};

export default useKeyPress;
