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
import { applicationApi } from '@/api/application';
import { Task } from '@/interfaces/Task';
import { getIsDailyRewardClaimed } from './utils';

interface ApplicationContext {
  energy: number;
  coins: number;
  level: number;
  progress: number;
  passiveIncome: number;
  photos: FileObject[];
  tasks: Task[];
  isDailyRewardClaimed: boolean | null;
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
  tasks: [],
  isDailyRewardClaimed: null,
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
  const isEnergyEmpty = useMemo(() => energy === 0, [energy]);
  const maxEnergy = useMemo(
    () => levelToMaxEnergy.get(level) as number,
    [level],
  );
  const progress = useMemo<number>(
    () => getUserProgressProcentage(coins),
    [coins],
  );
  const passiveIncome = useMemo<number>(
    () => getUserPassiveIncome(level),
    [level],
  );
  const coinsPerTap = useMemo(
    () => levelToCoinsPerTap.get(level) as number,
    [level],
  );
  const syncTimeoutId = useRef<NodeJS.Timeout>();

  const [tasks, setTasks] = useState<Task[]>([]);
  // TODO: update after user claims daily reward
  const [isDailyRewardClaimed, setIsDailyRewardClaimed] = useState<
    boolean | null
  >(null);

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
    console.log('regenerate for some', isEnergyFull, energy);
    if (isEnergyFull) {
      return;
    }

    intervalId = setInterval(increaseEnergy, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isEnergyFull, energy]);

  const clientReady = useCallback(async () => {
    const userData = await authenticate();
    await initializeApplication(userData);
  }, [authenticate]);

  const initializeApplication = useCallback(
    async (userData: User | null) => {
      if (!userData) {
        // do something
        return;
      }

      const photos = await photosApi.getBatch(userData.id);

      if (userData.referrerId) {
        await userApi.refer(userData.id, userData.referrerId);
      }

      const taskss = await applicationApi.getTasks(userData);
      console.log(taskss, 'taskssetset');
      setTasks(taskss ?? []);
      setIsDailyRewardClaimed(
        getIsDailyRewardClaimed(userData?.last_claimed_daily_reward_at),
      );
      setEnergy(userData.energy as number);
      setCoins(userData.coins as number);
      setPhotos(photos);
      isApplicationInitialized.current = true;
      router.replace(HOME_PAGE);
    },
    [router],
  );

  const syncStats = useCallback(
    (coins: number, energy: number) => {
      clearTimeout(syncTimeoutId.current);

      syncTimeoutId.current = setTimeout(() => {
        userApi.sync(user?.id as string, { coins, energy });
      }, 3000);
    },
    [user?.id],
  );

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
      tasks,
      isDailyRewardClaimed,
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
      tasks,
      passiveIncome,
      photos,
      isDailyRewardClaimed,
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
