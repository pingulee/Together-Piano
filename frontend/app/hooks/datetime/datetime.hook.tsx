import { useEffect, useState } from 'react';
import getDateTime from '@/app/utils/datetime/datetime.util';

export const useDateTime = () => {
  const [dateTime, setDateTime] = useState<string>();

  useEffect(() => {
    const updateDateTime = () => {
      const newDateTime = getDateTime();
      setDateTime(newDateTime);
    };

    updateDateTime(); // 컴포넌트 마운트 시 최초 한 번 실행

    const intervalId = setInterval(updateDateTime, 0); // 주어진 간격으로 반복 실행
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return dateTime;
};
