import { useState } from 'react';

export const sideOpen = () => {
  const [open, setOpen] = useState(false);

  return { open, setOpen };
};
