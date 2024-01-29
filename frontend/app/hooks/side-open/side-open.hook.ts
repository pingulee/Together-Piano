import { useState } from 'react';

export const sideOpen = () => {
  const [open, useOpen] = useState(false);

  return { open, useOpen };
};
