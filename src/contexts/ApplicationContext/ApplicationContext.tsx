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
import {
	getUserLevel,
	getUserPassiveIncome,
	getUserProgressProcentage,
	Level,
	levelToCoinsPerTap,
	levelToMaxEnergy,
	levelToPhotoPassiveIncome,
} from '@/constants';

import { PersonalizedTask } from '@/interfaces/Task';
import {
	claimReferral,
	getReferral,
	getReferrals,
	getReferrerInfo,
	getTasks,
	getUserPhotos,
	referUser,
	synchronizeTaps,
	updateDailyRewardCompletedDays,
	updatePassiveIncome
} from '@/api/api';
import { CoreUserFieldsFragment, FullUserTaskFragment } from '@/gql/graphql';
import { daysSinceDate, hoursSinceDateUTC } from '@/utils/date';
import { UserPhoto } from '@/interfaces/photo';

export type Referral = {
	firstName: string;
	lastName: string;
	coins: number;
	level: number;
}

interface ApplicationContext {
	energy: number;
	coins: number;
	level: number;
	progress: number;
	passiveIncome: number;
	photos: UserPhoto[];
	tasks: PersonalizedTask[];
	isAppInitialized: boolean;
	referrals: Referral[]
	increaseEnergy(): void;
	updatePhotos(photos: UserPhoto[]): void;
	increaseCoins(amount?: number): void;
	tap(): void;
	clientReady(): Promise<void>;
	updatePassiveIncomeLocal(type: 'photo'): void;
	updateUserTaskProgress(userTask: FullUserTaskFragment): void;
	maxEnergy: number;
}

const initialUserContext: ApplicationContext = {
	energy: 0,
	coins: 0,
	level: 1,
	progress: 0,
	passiveIncome: 0,
	updatePassiveIncomeLocal: () => {},
	photos: [],
	referrals: [],
	updatePhotos() {},
	tasks: [],
	isAppInitialized: false,
	maxEnergy: 0,
	increaseEnergy() {},
	increaseCoins() {},
	tap() {},
	async clientReady() {},
	updateUserTaskProgress() {},
};

const ApplicationContext =
	createContext<ApplicationContext>(initialUserContext);

export function ApplicationContextProvider({
	children,
}: PropsWithChildren<{}>) {
	const { authenticate, updateLocalUser, user } = useUserContext();

	const isInitializing = useRef(false);
	const [isAppInitialized, setIsAppInitialized] = useState(false);
	const [energy, setEnergy] = useState<number>(user?.energy as number);
	const [coins, setCoins] = useState<number>(user?.coins as number);
	const [photos, setPhotos] = useState<UserPhoto[]>([]);
	const [referrals, setReferrals] = useState<Referral[]>([]);
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
	const [passiveIncome, setPassiveIncome] = useState(
		getUserPassiveIncome(level),
	);
	const coinsPerTap = useMemo(
		() => levelToCoinsPerTap.get(level) as number,
		[level],
	);
	const syncTimeoutId = useRef<NodeJS.Timeout>();

	const [tasks, setTasks] = useState<PersonalizedTask[]>([]);

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
	}, [energy, maxEnergy]);

	const increaseCoins = useCallback(
		(amount = coinsPerTap): number => {
			const newCoins = coins + amount;
			setCoins(newCoins);
			return newCoins;
		},
		[coinsPerTap, coins],
	);

	// regenerate energy
	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (isEnergyFull) {
			return;
		}

		intervalId = setInterval(increaseEnergy, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [isEnergyFull, energy, increaseEnergy]);

	const clientReady = useCallback(async () => {
		const userData = await authenticate();
		await userData;
	}, [authenticate]);

	useEffect(() => {
		const initializeApp = async () => {
			isInitializing.current = true;

			window.Telegram.WebApp.setHeaderColor('#00298d');

			const photos = await getUserPhotos(user.id);
			let coins = user.coins;

			// user.telegram_id !== user.referrerId
			if (user.referrerId && true) {
				const userReferral = await getReferral(user.telegram_id as string);
				if (!userReferral) {
					const refUser = await getReferrerInfo(user.referrerId);
					const isPrem = refUser?.[0].is_premium || false;
					coins = coins + (isPrem ? 25000 : 5000);
					// Not yet referred previously
					referUser(user.referrerId, user.telegram_id as string, user.id, coins);
				}
			}

			let personalizedTasks = await getTasks(user.id);

			const dailyRewardTask =
				personalizedTasks &&
				personalizedTasks.find((task) => task.id === 'daily_reward');
			if (
				!!user.last_daily_reward &&
				daysSinceDate(new Date(user.last_daily_reward)) > 1 &&
				dailyRewardTask?.userTask?.task_id
			) {
				// user started daily quest but skipped day(s)
				await updateDailyRewardCompletedDays(
					user.id,
					dailyRewardTask.userTask.id,
					0,
				);
				personalizedTasks = personalizedTasks?.map((task) => {
					if (task.id === 'daily_reward') {
						return {
							...task,
							userTask: {
								...task.userTask,
								days_completed: 0,
							},
						} as PersonalizedTask;
					}

					return task;
				});
			}

			// User may change their passive income rate during the app (update this value each time then)
			const hrsSinceLastHourlyReward = hoursSinceDateUTC(
				new Date(user.last_hourly_reward),
			);
			const passiveIncomeSinceLast = hrsSinceLastHourlyReward * passiveIncome;

			const photosPassiveIncome = photos.reduce((acc, curr) => {
				const passInc = levelToPhotoPassiveIncome.get(
					curr.level_at_time as Level,
				);
				return passInc ? acc + passInc : acc;
			}, 0);

			coins =
				coins +
				passiveIncomeSinceLast +
				hrsSinceLastHourlyReward * photosPassiveIncome;
			await updatePassiveIncome(user.id, coins, new Date().toUTCString());

			const referrals = await getReferrals(user.telegram_id as string);

			const referralsCoins = referrals.reduce((acc, curr) => {
				if (!curr?.is_claimed_by_referrer) {
					acc = acc + (curr.is_premium ? 25000 : 5000);
				}
				return acc;
			}, 0);
			coins += referralsCoins;

			await claimReferral(user.id, user.telegram_id as string, coins);
			setReferrals(referrals.map((ref) => ({
				firstName: ref.first_name,
				lastName: ref.last_name,
				level: getUserLevel(ref.coins),
				coins: ref.coins,
			})));

			setPassiveIncome(getUserPassiveIncome(level) + photosPassiveIncome);
			setTasks(personalizedTasks ?? []);
			setEnergy(user.energy as number);
			setCoins(coins);
			setPhotos(photos);
			setIsAppInitialized(true);
			isInitializing.current = false;
		};
		if (isInitializing.current) {
			return;
		}

		initializeApp().then(() => {
			window.Telegram.WebApp.disableVerticalSwipes();
			window.Telegram.WebApp.ready();
			!window.Telegram.WebApp.isExpanded && window.Telegram.WebApp.expand();
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const syncStats = useCallback(
		(coins: number, energy: number) => {
			clearTimeout(syncTimeoutId.current);

			syncTimeoutId.current = setTimeout(async () => {
				const data = await synchronizeTaps(user.id, coins, energy);
				const updatedUser = data.updateusersCollection[0];
				if (updatedUser) {
					updateLocalUser(updatedUser as CoreUserFieldsFragment);
				}
			}, 3000);
		},
		[updateLocalUser, user.id],
	);

	const updateUserTaskProgress = useCallback(
		(userTask: FullUserTaskFragment) => {
			const updatedTasks = tasks.map((task) => {
				if (userTask.task_id === task.id) {
					return {
						...task,
						userTask,
					};
				}

				return task;
			});

			setTasks(updatedTasks);
		},
		[tasks],
	);

	const tap = useCallback(() => {
		if (isEnergyEmpty) {
			return;
		}
		const actualCoins = increaseCoins();
		const actualEnergy = decreaseEnergy();
		syncStats(actualCoins, actualEnergy);
	}, [isEnergyEmpty, syncStats, increaseCoins, decreaseEnergy]);

	const updatePhotos = useCallback((photos: UserPhoto[]) => {
		setPhotos(photos);
	}, []);

	const updatePassiveIncomeLocal = useCallback((type: 'photo') => {
		if (type === 'photo') {
			setPassiveIncome(passiveIncome + (levelToPhotoPassiveIncome.get(level) as number));
		}
	}, [passiveIncome]);

	const value = useMemo<ApplicationContext>(
		() => ({
			energy,
			coins,
			referrals,
			updatePassiveIncomeLocal,
			level,
			progress,
			passiveIncome,
			photos,
			updatePhotos,
			tasks,
			increaseEnergy,
			increaseCoins,
			clientReady,
			tap,
			isAppInitialized,
			updateUserTaskProgress,
			maxEnergy,
		}),
		[
			energy,
			coins,
			level,
			updatePassiveIncomeLocal,
			progress,
			tasks,
			passiveIncome,
			updatePhotos,
			photos,
			tap,
			clientReady,
			increaseCoins,
			increaseEnergy,
			isAppInitialized,
			updateUserTaskProgress,
			maxEnergy,
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
