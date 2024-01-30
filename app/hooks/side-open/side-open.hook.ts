import React, { useState } from 'react';

/**
 * 사이드바의 열림/닫힘 상태를 관리하는 훅
 * @returns {object} 상태값(open)과 상태를 설정하는 함수(setOpen)
 */
export const useSideOpen = () => {
  const [open, setOpen] = useState<boolean>(false);

  return { open, setOpen };
};
