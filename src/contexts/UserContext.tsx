'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { authApi } from '@/api/auth';
import { User } from '@/interfaces/User';
import { userApi } from '@/api/user';

interface UserContext {
  user: User | null;
  authenticate(): Promise<User | null>;
}

const initialUserContext = {
  user: null,
  async authenticate() {
    return Promise.resolve(null);
  },
};

const UserContext = createContext<UserContext>(initialUserContext);

export function UserContextProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User | null>(null);

  const authenticate = useCallback(async () => {
    if (!!user) {
      return user;
    }

    const authData = await authApi.authenticate();
    const userData = await userApi.getApplicationData(authData.id);
    const fullUserData = { ...authData, ...userData };
    setUser(fullUserData);
    return fullUserData;
  }, [user]);

  const value = useMemo<UserContext>(
    () => ({
      user,
      authenticate,
    }),
    [user, authenticate],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext is used outside of its Provider');
  }

  return useContext(UserContext);
}
