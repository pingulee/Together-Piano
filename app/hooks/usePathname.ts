import { useRouter } from 'next/router';

export const usePathname = () => {
  const router = useRouter();
  return router.pathname;
};
