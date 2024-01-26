'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Setting() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      <button onClick={() => signIn('google', { callbackUrl: '/' })}>gg</button>
    </div>
  );
}
