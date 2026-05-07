import { useEffect } from 'react';
import useAuthStore from '@/lib/store';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    useAuthStore.getState().loadAuth();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
