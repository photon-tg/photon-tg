'use client';

import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState
} from 'react';
import { useUserContext } from '../UserContext';
import {
	getUserLevel,
	Level, levelToMaxEnergy,
	levelToPhotoPassiveIncome, levelToPhotoReward
} from '@/constants';

import { PersonalizedTask } from '@/interfaces/Task';
import {
	claimFirstTask,
	ClaimTaskParams,
	getUserData, postUserPhoto,
	synchronizeTaps,
	updateUser
} from '@/api/api';
import { ReferralFragment, UserPhotoFragment } from '@/gql/graphql';
import { calculateEnergyGained, hoursSinceDate } from '@/utils/date';
import { UserPhoto } from '@/interfaces/photo';
import { Referral, useReferrals } from '@/contexts/ApplicationContext/hooks/useReferrals/useReferrals';
import {
	ApplicationActionType,
	applicationReducer,
	applicationStateInitialValue,
} from '@/contexts/ApplicationContext/ApplicationReducer';
import { useTasks } from '@/contexts/ApplicationContext/hooks/useTasks/useTasks';
import { claimTask as claimTaskReq } from '@/api/api';

interface ApplicationContext {
	energy: number;
	coins: number;
	level: number;
	progress: number;
	passiveIncome: number;
	photos: UserPhoto[];
	tasks: PersonalizedTask[];
	isAppInitialized: boolean;
	referrals: ReferralFragment[];
	maxEnergy: number;
	isDailyRewardClaimed: boolean;
	lastPhoto?: string | null;
	addPhoto(photo: string): Promise<void>;
	onTap(): void;
	claimTask(type: 'daily_reward', task: PersonalizedTask): Promise<void>;
}

const initialApplicationState: ApplicationContext = {
	onTap() {},
	energy: 0,
	coins: 0,
	level: 1,
	progress: 0,
	passiveIncome: 0,
	photos: [],
	referrals: [],
	addPhoto() { return Promise.resolve() },
	claimTask() { return Promise.resolve() },
	tasks: [],
	isAppInitialized: false,
	maxEnergy: 0,
	isDailyRewardClaimed: false,
};

const ApplicationContext =
	createContext<ApplicationContext>(initialApplicationState);

export function ApplicationContextProvider({
	children,
}: PropsWithChildren<{}>) {
	const { user } = useUserContext();
	const { claimReferrals, refer, referrals } = useReferrals(user);
	const { initDailyReward } = useTasks(user);

	const [state, dispatch] = useReducer(applicationReducer, applicationStateInitialValue);
	const [isAppInitialized, setIsAppInitialized] = useState(false);

	const syncTimeoutId = useRef<NodeJS.Timeout>();

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (state.energy === state.maxEnergy) return;

		function regenerateEnergy() {
			dispatch({
				type: ApplicationActionType.REGENERATE_ENERGY,
			});
		}

		intervalId = setInterval(regenerateEnergy, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [state.energy, state.level, state.maxEnergy]);

	useEffect(() => {
		if (isAppInitialized) return;

		async function initApp() {
			const isFirstTime = user.is_referred === null;

			const userData = await getUserData(user.id, user.telegram_id);

			const [updatedLastDailyReward, updatedTasks] = await initDailyReward(userData.tasks);

			const referenceBonusCoins = isFirstTime ? (await refer() || 0) : 0;
			const referralsCoins = await claimReferrals(userData.friends);
			const photosPassiveIncomeCoins = calculatePhotosPassiveIncome(userData.photos, user.last_hourly_reward);

			const coinsAfterRewards = user.coins + referenceBonusCoins + photosPassiveIncomeCoins + referralsCoins;

			const { newEnergy } = calculateEnergyGained(user.last_sync, user.energy);

			const maxEnergy = levelToMaxEnergy.get(getUserLevel(user.coins))!;
			const updatedEnergy = newEnergy > maxEnergy ? maxEnergy : newEnergy;

			const nowUTC = new Date().toUTCString();

			await updateUser({ userId: user.id, coins: coinsAfterRewards, lastHourlyReward: nowUTC, user, isReferred: !!referenceBonusCoins });

			dispatch({
				type: ApplicationActionType.INIT,
				payload: {
					coins: coinsAfterRewards,
					energy: updatedEnergy,
					photos: userData.photos,
					tasks: updatedTasks ?? userData.tasks,
					friends: userData.friends,
					referred: userData.referred,
					lastDailyReward: updatedLastDailyReward,
					lastPhoto: user.last_photo,
				}
			});
		}

		initApp().then(() => {
			setIsAppInitialized(true);

			window.Telegram.WebApp.setHeaderColor('#092646');
			window.Telegram.WebApp.disableVerticalSwipes();
			window.Telegram.WebApp.ready();
			!window.Telegram.WebApp.isExpanded && window.Telegram.WebApp.expand();
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const syncStats = useCallback(
		() => {
			clearTimeout(syncTimeoutId.current);

			function sync() {
				synchronizeTaps(user.id, state.coins, state.energy);
			}

			syncTimeoutId.current = setTimeout(sync, 3000);
		},
		[state.coins, state.energy, user.id],
	);

	const addPhoto = useCallback(async (photoBase64: string) => {
		const { photo } = await postUserPhoto(user.id, photoBase64, state.level, state.coins) ?? {};
		if (!photo) {
			return;
		}

		const coinsForPhoto = levelToPhotoReward.get(state.level)!;
		await updateUser({ coins: coinsForPhoto + state.coins, user });

		dispatch({
			type: ApplicationActionType.ADD_PHOTO,
			payload: {
				photo,
				coinsForPhoto,
			}
		})
	}, [state.coins, state.level, user]);

	const onTap = useCallback(() => {
		dispatch({
			type: ApplicationActionType.TAP,
			payload: {}
		});
		syncStats();
	}, [syncStats]);

	const claimTask = useCallback(async (type: 'daily_reward', task: PersonalizedTask) => {
		window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

		const userTaskExists = !!task.userTask?.id;
		const updatedTaskData = claimTaskHelper(type, task);
		const newCoins = state.coins + (updatedTaskData?.rewardCoins || 0);

		const claimTaskParams: ClaimTaskParams = {
			taskId: task.id,
			isCompleted: updatedTaskData?.isCompleted ?? false,
			userTaskId: task.userTask?.id,
			coins: newCoins,
			daysCompleted: updatedTaskData?.completedDays ?? 0,
			lastDailyReward: updatedTaskData?.lastDailyReward ?? user.last_daily_reward,
			userId: user.id,
		};

		try {
			const updatedTask = userTaskExists ? await claimTaskReq(claimTaskParams) : await claimFirstTask(claimTaskParams);

			if (!updatedTask) {
				return
			}

			dispatch({
				type: ApplicationActionType.CLAIM_TASK,
				payload: {
					type: 'daily_reward',
					coins: newCoins,
					task: updatedTask,
					lastDailyReward: updatedTaskData?.lastDailyReward,
				}
			})
		} catch (error) {
			// TODO
		}
	}, [state.coins, user.id, user.last_daily_reward]);


	const value = useMemo<ApplicationContext>(
		() => ({
			energy: state.energy,
			coins: state.coins,
			level: state.level,
			progress: state.progress,
			passiveIncome: state.passiveCoins,
			photos: state.photos,
			maxEnergy: state.maxEnergy,
			isDailyRewardClaimed: state.isDailyRewardClaimed,
			referrals: state.friends,
			addPhoto,
			tasks: state.tasks,
			isAppInitialized,
			onTap,
			claimTask,
			lastPhoto: state.lastPhoto,
		}),
		[addPhoto, claimTask, isAppInitialized, onTap, state.coins, state.energy, state.friends, state.isDailyRewardClaimed, state.lastPhoto, state.level, state.maxEnergy, state.passiveCoins, state.photos, state.progress, state.tasks],
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

function calculatePhotosPassiveIncome(photos: UserPhotoFragment[] | undefined, lastHourlyReward: string) {
	const photosPassiveIncome = photos?.reduce((total, photo) => {
		/* means that we will calculate passive since the photo creation time */
		const isDoneAfterLastReward = new Date(photo.created_at) > new Date(lastHourlyReward);
		const lastClaimedReward = isDoneAfterLastReward ? photo.created_at : lastHourlyReward;
		const hoursSinceLastReward = hoursSinceDate(lastClaimedReward);
		const photoPassiveIncomePerHour = levelToPhotoPassiveIncome.get(photo.level_at_time as Level) ?? 0;
		const reward = hoursSinceLastReward * photoPassiveIncomePerHour;

		return total + reward;
	}, 0);

	return Math.round(photosPassiveIncome || 0);
}

export type ClaimRewardHelperRT = {
	lastDailyReward?: string;
	completedDays: number;
	isCompleted: boolean;
	rewardCoins: number;
}

function claimTaskHelper(type: 'daily_reward', task: PersonalizedTask): ClaimRewardHelperRT | undefined {
	switch (type) {
		case 'daily_reward': {
			const previousCompletedDays = task.userTask?.days_completed || 0;
			const completedDays = previousCompletedDays + 1;
			const rewardCoins = task.rewardByDay?.find(
				({ day }) => day === completedDays,
			)?.reward;

			if (!rewardCoins) {
				throw new Error();
			}

			const lastDailyReward = new Date().toUTCString();
			const isCompleted = completedDays === 10;

			return {
				rewardCoins,
				isCompleted,
				completedDays,
				lastDailyReward,
			}
		}

		default:
			return;
	}
}
