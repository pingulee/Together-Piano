import { useEffect, useState } from 'react';

export const useUserCountry = () => {
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    fetch('https://geolocation-db.com/json/')
      .then((response) => response.json())
      .then((data) => {
        setUserCountry(data.country_code);
      })
      .catch((error) => console.error('Error fetching user country: ', error));
  }, []);

  return userCountry;
};
