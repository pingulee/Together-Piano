'use client';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/time');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return <div>{data ? <p>{data.test}</p> : <p>Loading...</p>}</div>;
}
