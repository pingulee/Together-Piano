import { useEffect, useState } from 'react';

export function getUserIp() {
  const [ip, setIp] = useState<string>('');

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/userIp');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('IP 주소를 가져오는 데 실패했습니다.', error);
      }
    };

    fetchIp();
  }, []);

  return ip;
}
