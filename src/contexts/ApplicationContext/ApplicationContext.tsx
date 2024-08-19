'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useUserContext } from '../UserContext';
import { useRouter } from 'next/navigation';
import { HOME_PAGE } from '@/constants/urls';
import { userApi } from '@/api/user';
import { User } from '@/interfaces/User';
import {
  getUserLevel,
  getUserPassiveIncome,
  getUserProgressProcentage,
  Level,
  levelToCoinsPerTap,
  levelToMaxEnergy,
} from '@/constants';
import { photosApi } from '@/api/photos';
import { FileObject } from '@supabase/storage-js';

interface ApplicationContext {
  energy: number;
  coins: number;
  level: number;
  progress: number;
  passiveIncome: number;
  photos: FileObject[];
  increaseEnergy(): void;
  increaseCoins(amount?: number): void;
  tap(): void;
  clientReady(): Promise<void>;
}

const initialUserContext = {
  energy: 0,
  coins: 0,
  level: 1,
  progress: 0,
  passiveIncome: 0,
  photos: [],
  increaseEnergy() {},
  increaseCoins() {},
  tap() {},
  async clientReady() {},
};

const ApplicationContext =
  createContext<ApplicationContext>(initialUserContext);

export function ApplicationContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const { authenticate, user } = useUserContext();

  const router = useRouter();

  const isApplicationInitialized = useRef(false);
  const [energy, setEnergy] = useState<number>(0);
  const [coins, setCoins] = useState<number>(initialUserContext.coins);
  const [photos, setPhotos] = useState<FileObject[]>([]);
  const level = useMemo<Level>(() => getUserLevel(coins), [coins]);
  const isEnergyFull = useMemo(
    () => energy >= (levelToMaxEnergy.get(level) as number),
    [energy, level],
  );
  const isEnergyEmpty = useMemo(
    () => energy === 0,
    [energy],
  );
  const maxEnergy = useMemo(
    () => levelToMaxEnergy.get(level) as number,
    [level],
  );
  const progress = useMemo<number>(
    () => getUserProgressProcentage(coins),
    [coins],
  );
  const passiveIncome = useMemo<number>(() => getUserPassiveIncome(level), []);
  const coinsPerTap = useMemo(() => (levelToCoinsPerTap.get(level) as number), [level]);
  const syncTimeoutId = useRef<NodeJS.Timeout>();

  const decreaseEnergy = useCallback((): number => {
    const newEnergy = energy - 1;
    setEnergy(newEnergy);
    return newEnergy;
  }, [energy]);

  const increaseEnergy = useCallback(() => {
    if (energy >= maxEnergy) {
      return;
    }

    setEnergy((prevEnergy) => {
      const nextEnergyValue = prevEnergy + 3;
      return nextEnergyValue > maxEnergy ? maxEnergy : nextEnergyValue;
    });
  }, [energy]);

  const increaseCoins = useCallback((): number => {
    const newCoins = coins + coinsPerTap;
    setCoins(newCoins);
    return newCoins;
  }, [coinsPerTap, coins]);

  // regenirate energy
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isEnergyFull) {
      return;
    }

    intervalId = setInterval(increaseEnergy, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isEnergyFull]);

  const clientReady = useCallback(async () => {
    const userData = await authenticate();
    await initializeApplication(userData);
  }, []);

  const initializeApplication = useCallback(
    async (userData: User | null) => {
      if (!userData) {
        // do something
        return;
      }

      const result = await userApi.getApplicationData(userData.id);
      const photos = await photosApi.getBatch(userData.id);

      setEnergy(result.energy);
      setCoins(result.coins);
      setPhotos(photos);
      isApplicationInitialized.current = true;
      router.replace(HOME_PAGE);
    },
    [user],
  );

  const syncStats = useCallback((coins: number, energy: number) => {
    clearTimeout(syncTimeoutId.current);

    syncTimeoutId.current = setTimeout(() => {
      userApi.sync(user?.id as string, { coins, energy });
    }, 3000);
  }, [user?.id]);

  const tap = useCallback(() => {
    if (isEnergyEmpty) {
      return;
    }
    const actualCoins = increaseCoins();
    const actualEnergy = decreaseEnergy();
    syncStats(actualCoins, actualEnergy);
  }, [isEnergyEmpty, syncStats, increaseCoins, decreaseEnergy]);

  const value = useMemo<ApplicationContext>(
    () => ({
      energy,
      coins,
      level,
      progress,
      passiveIncome,
      photos,
      increaseEnergy,
      increaseCoins,
      clientReady,
      tap,
    }),
    [
      energy,
      coins,
      level,
      progress,
      tap,
      clientReady,
      increaseCoins,
      increaseEnergy,
    ],
  );

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext is used outside of its Provider');
  }

  return context;
}
