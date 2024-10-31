import { ValidatedTelegramUser } from '@/app/api/check-telegram-data/route';
import axios, { axiosInstance } from '@/api/axios';
import { photosBucketURL, supabase } from '@/api/supabase';
import { SignUpData, UserCredentials, UserErrorType } from '@/model/user/types';
import apolloClient from '@/api/graphql';
import { GET_USER } from '@/graphql/queries';
import {
	GetAllUserPhotos,
	GetReferrals,
	GetUserTasks,
} from '@/model/user/queries';
import {
	ADD_USER_PHOTO,
	CLAIM_FIRST_TASK,
	CLAIM_TASK,
	SYNCHRONIZE_TAPS,
	UPDATE_DAILY_REWARD_COMPLETED_DAYS,
	UPDATE_USER,
} from '@/graphql/mutations';
import { ClaimReferrals } from '@/model/user/mutations';
import { ApolloQueryResult } from '@apollo/client';
import {
	BattlePhotoFragment,
	CoreUserFieldsFragment,
	GetAllUserPhotosQuery,
	GetUserPhotosQuery,
	GetUserTasksQuery,
	UserQuery,
	UserTaskFragment,
} from '@/gql/graphql';
import { parseNodes } from '@/utils/graphql';
import { AxiosResponse } from 'axios';
import * as Sentry from '@sentry/nextjs';
import { Friend, GetFriendsResponse } from '@/app/api/friends/route';
import { GetUserBattlePhotos } from '@/model/battle/queries';

export const validateTelegramData = async (dataCheckString: string) => {
	return axios.post<ValidatedTelegramUser>('/check-telegram-data', {
		dataCheckString:
			process.env.NODE_ENV === 'development'
				? process.env.NEXT_PUBLIC_MOCK_TG_DATA
				: dataCheckString,
	});
};

export const signUp = (credentials: UserCredentials, signUpData: SignUpData) =>
	supabase.auth.signUp({
		...credentials,
		options: {
			data: signUpData,
		},
	});

export const signIn = (credentials: UserCredentials) =>
	supabase.auth.signInWithPassword(credentials);

export const getUser = (id: string) =>
	apolloClient.query({
		query: GET_USER,
		fetchPolicy: 'no-cache',
		variables: {
			id,
		},
	});

export const getPhotos = (id: string) =>
	apolloClient.query({
		query: GetAllUserPhotos,
		fetchPolicy: 'no-cache',
		variables: {
			userId: id,
		},
	});

export const getUserTasks = (id: string) =>
	apolloClient.query({
		query: GetUserTasks,
		fetchPolicy: 'no-cache',
		variables: {
			userId: id,
		},
	});

export const updateDailyRewardCompletedDays = async (
	userId: string,
	userTaskId: string,
	isCompleted: boolean,
	completedDays: number,
) => {
	return apolloClient.mutate({
		mutation: UPDATE_DAILY_REWARD_COMPLETED_DAYS,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			userTaskId,
			isCompleted,
			completedDays,
		},
	});
};

export const uploadPhoto = (
	userId: string,
	photoId: string,
	level: number,
	coins: number,
	lastPhoto: string,
) =>
	apolloClient.mutate({
		mutation: ADD_USER_PHOTO,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			photoId,
			lastPhoto,
			currentLevel: level,
			url: `${photosBucketURL}/${userId}/${photoId}`,
			coins,
		},
	});

export const synchronizeTaps = (
	userId: string,
	coins: number,
	energy: number,
	lastSync: string,
) =>
	apolloClient.mutate({
		mutation: SYNCHRONIZE_TAPS,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			coins,
			energy,
			lastSync,
		},
	});

export type ClaimTaskParams = {
	userId: string;
	userTaskId?: string;
	taskId: string;
	daysCompleted?: number;
	coins: number;
	isCompleted: boolean;
	lastDailyReward?: string | null;
	status?: string;
	updatedAt?: string;
};

export const claimFirstTask = (params: ClaimTaskParams) =>
	apolloClient.mutate({
		mutation: CLAIM_FIRST_TASK,
		fetchPolicy: 'no-cache',
		variables: {
			userId: params.userId,
			taskId: params.taskId,
			lastDailyReward: params.lastDailyReward ?? null,
			daysCompleted: params.daysCompleted ?? null,
			coins: params.coins,
			completed: params.isCompleted,
			status: params.status ?? null,
			updatedAt: params.updatedAt ?? new Date().toUTCString(),
		},
	});

export const claimTask = (params: ClaimTaskParams) =>
	apolloClient.mutate({
		mutation: CLAIM_TASK,
		fetchPolicy: 'no-cache',
		variables: {
			userId: params.userId,
			userTaskId: params.userTaskId!,
			lastDailyReward: params.lastDailyReward ?? null,
			daysCompleted: params.daysCompleted ?? null,
			coins: params.coins,
			completed: params.isCompleted,
			status: params.status ?? null,
			updatedAt: params.updatedAt ?? new Date().toUTCString(),
		},
	});

export interface ReferUserPayload {
	userId: string;
	referrer: string;
	isPremium: boolean;
}

export const referUser = async (payload: ReferUserPayload) =>
	axiosInstance.post('/refer', payload);

export const fetchPhotos = async (
	userId: string,
): Promise<BattlePhotoFragment[]> => {
	try {
		const photosResponse: ApolloQueryResult<GetAllUserPhotosQuery> =
			await getPhotos(userId);
		if (photosResponse.error) {
			return [];
		}

		const photos = parseNodes(
			photosResponse.data.battle_photosCollection?.edges ?? [],
		);

		return photos;
	} catch (error) {
		return [];
	}
};

export const fetchTasks = async (
	userId: string,
): Promise<UserTaskFragment[]> => {
	try {
		const tasksResponse: ApolloQueryResult<GetUserTasksQuery> =
			await getUserTasks(userId);
		if (tasksResponse.error) {
			return [];
		}

		const tasks = parseNodes(
			tasksResponse.data.user_tasksCollection?.edges ?? [],
		);

		return tasks;
	} catch (error) {
		return [];
	}
};

export const fetchFriends = async (userId: string): Promise<Friend[]> => {
	try {
		const friendsResponse: AxiosResponse<GetFriendsResponse> =
			await getFriends(userId);

		if (friendsResponse.data.meta.error || !friendsResponse.data.data) {
			return [];
		}

		return friendsResponse.data.data;
	} catch (error) {
		return [];
	}
};

export type FetchUserResponse = {
	data?: CoreUserFieldsFragment;
	meta?: { error: UserErrorType };
};

export const fetchUser = async (userId: string): Promise<FetchUserResponse> => {
	try {
		const userResponse: ApolloQueryResult<UserQuery> = await getUser(userId);
		const user = userResponse.data.usersCollection?.edges[0].node;
		if (userResponse.error || !user) {
			return {
				meta: {
					error: UserErrorType.SERVER_ERROR,
				},
			};
		}

		return {
			data: user,
		};
	} catch (error) {
		Sentry.captureException(error, {
			contexts: {
				user: {
					id: userId,
				},
			},
		});

		return {
			meta: {
				error: UserErrorType.SERVER_ERROR,
			},
		};
	}
};

export const getFriends = (userId: string) =>
	axiosInstance.post('/friends', { userId });

export const getUserReferrals = (userId: string) =>
	apolloClient.query({
		query: GetReferrals,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
		},
	});

export const claimUserReferralsBonus = (userId: string) =>
	apolloClient.mutate({
		mutation: ClaimReferrals,
		fetchPolicy: 'no-cache',
		variables: {
			referrerUserId: userId,
		},
	});

export type UpdateUserOptions = {
	userId?: string;
	coins?: number;
	lastHourlyReward?: string;
	lastDailyReward?: string | null;
	lastLikesClaim?: string | null;
	user: CoreUserFieldsFragment;
	isReferred?: boolean;
	energy?: number;
};

export async function updateUser({
	userId,
	coins,
	lastHourlyReward,
	energy,
	lastDailyReward,
	user,
	isReferred,
	lastLikesClaim,
}: UpdateUserOptions) {
	const { errors, data } = await apolloClient.mutate({
		mutation: UPDATE_USER,
		fetchPolicy: 'no-cache',
		variables: {
			userId: userId ?? user.id,
			coins: coins ?? user.coins,
			lastHourlyReward: lastHourlyReward ?? user.last_hourly_reward,
			isReferred: isReferred ?? user.is_referred,
			lastDailyReward: lastDailyReward ?? user.last_daily_reward,
			energy: energy ?? user.energy,
			lastLikesClaim: lastLikesClaim ?? user.last_likes_claim,
		},
	});

	if (errors?.length) {
		throw new Error();
	}

	return data;
}
