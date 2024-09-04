import { UserPhoto } from '@/interfaces/photo';
import { PersonalizedTask } from '@/interfaces/Task';
import { ReferralFragment, UserPhotoFragment } from '@/gql/graphql';
import {
	getUserLevel, getUserLevelProgress,
	Level,
	levelToCoinsPerTap,
	levelToMaxEnergy,
	levelToPhotoPassiveIncome
} from '@/constants';
import { isNextDay } from '@/utils/date';

export interface ApplicationState {
	coins: number;
	energy: number;
	passiveCoins: number;
	photos: UserPhoto[];
	tasks: PersonalizedTask[];
	friends: ReferralFragment[];
	referred: ReferralFragment | null;
	level: Level;
	progress: number;
	maxEnergy: number;
	isDailyRewardClaimed: boolean;
	lastPhoto: string | null | undefined;
}

export const applicationStateInitialValue: ApplicationState = {
	coins: 0,
	energy: 0,
	passiveCoins: 0,
	photos: [],
	tasks: [],
	referred: null,
	friends: [],
	level: 1,
	maxEnergy: 0,
	progress: 0,
	isDailyRewardClaimed: false,
	lastPhoto: null,
}

export function applicationReducer(state = applicationStateInitialValue, action: ApplicationAction): ApplicationState {
	switch (action.type) {
		case ApplicationActionType.INIT: {
			const level = getUserLevel(action.payload.coins);
			return {
				...state,
				coins: action.payload.coins,
				energy: action.payload.energy,
				tasks: enhanceTasks(action.payload.tasks ?? []),
				photos: action.payload.photos ?? [],
				friends: action.payload.friends ?? [],
				referred: action.payload.referred ?? null,
				passiveCoins: calculatePassiveCoins(action.payload.photos),
				maxEnergy: levelToMaxEnergy.get(level)!,
				progress: getUserLevelProgress(action.payload.coins),
				isDailyRewardClaimed: getIsDailyRewardClaimed(action.payload.lastDailyReward),
				lastPhoto: action.payload.lastPhoto,
				level,
			}
		}

		case ApplicationActionType.TAP: {
			const newCoins = state.coins + levelToCoinsPerTap.get(state.level)!;
			return {
				...state,
				coins: newCoins,
				progress: getUserLevelProgress(newCoins),
				energy: state.energy - 1,
			}
		}

		case ApplicationActionType.REGENERATE_ENERGY: {
			const nextEnergy = state.energy + 3;
			return {
				...state,
				energy: nextEnergy > state.maxEnergy ? state.maxEnergy : nextEnergy,
			}
		}

		case ApplicationActionType.ADD_PHOTO: {
			const newPhotos = [...state.photos, action.payload.photo];
			const newCoins = action.payload.coinsForPhoto + state.coins;
			return {
				...state,
				coins: newCoins,
				photos: newPhotos,
				passiveCoins: calculatePassiveCoins(newPhotos),
				level: getUserLevel(newCoins),
			}
		}

		case ApplicationActionType.CLAIM_TASK: {
			const newLevel = getUserLevel(action.payload.coins);
			const updatedTasks = state.tasks.map((task) =>
				task.id === action.payload.task.id ? action.payload.task : task
			);

			return {
				...state,
				coins: action.payload.coins,
				progress: getUserLevelProgress(action.payload.coins),
				tasks: enhanceTasks(updatedTasks),
				level: newLevel,
				maxEnergy: levelToMaxEnergy.get(newLevel)!,
				isDailyRewardClaimed: getIsDailyRewardClaimed(action.payload.lastDailyReward),
			}
		}

		default:
			return state;
	}
}

export enum ApplicationActionType {
	INIT = 'INIT',
	ADD_PHOTO = 'ADD_PHOTO',
	ADD_COINS = 'ADD_COINS',
	TAP = 'TAP',
	REGENERATE_ENERGY = 'REGENERATE_ENERGY',
	CLAIM_TASK = 'CLAIM_TASK',
}

export type ApplicationAction = {
	type: ApplicationActionType.INIT;
	payload: InitActionPayload;
} | {
	type: ApplicationActionType.ADD_PHOTO;
	payload: AddPhotoActionPayload;
} | {
	type: ApplicationActionType.TAP;
	payload: {};
} | {
	type: ApplicationActionType.REGENERATE_ENERGY;
} | {
	type: ApplicationActionType.ADD_COINS;
	payload: AddCoinsPayload;
} | {
	type: ApplicationActionType.CLAIM_TASK;
	payload: ClaimTaskPayload;
}

export type ClaimTaskPayload = {
	type: 'daily_reward';
	task: PersonalizedTask;
	coins: number;
	lastDailyReward?: string | null;
}

export type AddCoinsPayload = {
	coins: number;
}

export type AddPhotoActionPayload = {
	photo: UserPhotoFragment;
	coinsForPhoto: number;
}

export type InitActionPayload = {
	coins: number;
	energy: number;
	photos: UserPhoto[] | undefined;
	tasks: PersonalizedTask[] | undefined;
	friends: ReferralFragment[] | undefined;
	referred: ReferralFragment | undefined;
	lastDailyReward?: string | null;
	lastPhoto: string | null | undefined;
};

function calculatePassiveCoins(photos?: UserPhoto[]) {
	const photosPassiveIncome = photos?.reduce((sum, photo) => {
		const photoPassiveCoins = levelToPhotoPassiveIncome.get(photo.level_at_time as Level)!;
		sum += photoPassiveCoins;
		return sum;
	}, 0) ?? 0;

	return photosPassiveIncome;
}

function enhanceTasks(tasks: PersonalizedTask[]) {
	return tasks.map((task) => {
		return {
			...task,
			rewardByDay: task.reward_by_day && JSON.parse(task.reward_by_day),
		}
	});
}

function getIsDailyRewardClaimed(lastDailyReward: string | undefined | null) {
	if (!lastDailyReward) {
		return false;
	}

	return !isNextDay(lastDailyReward);
}
