import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loadAuth } = useAuthStore();

  useEffect(() => {
    loadAuth();
    const token = localStorage.getItem('token');
    if (token || isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router, isAuthenticated, loadAuth]);

  return null;
}
