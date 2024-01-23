'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log('이미 로그인 상태');
      router.push('/'); // '/' 경로로 리디렉션
    }
  }, [session, router]);

  return (
    <div>
      <button>
        
      </button>
    </div>
  );
}
