import { useState } from 'react';

export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);

  return { isFocused, setIsFocused };
};