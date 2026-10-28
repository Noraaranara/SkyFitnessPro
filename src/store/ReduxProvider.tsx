'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { clearUser, setToken, setUser } from './features/authSlice';
import { getCurrentUser } from '@/services/auth/authApi';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const response = await getCurrentUser(token);
        const user = response.user;

        storeRef.current?.dispatch(setUser(user));
        storeRef.current?.dispatch(setToken(token))

        localStorage.setItem('user', JSON.stringify(user));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        storeRef.current?.dispatch(clearUser());
      }
    };

    restoreAuth();
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
