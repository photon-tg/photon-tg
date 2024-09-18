import { ValidatedTelegramUser } from '@/app/api/check-telegram-data/route';
import axios, { axiosInstance } from '@/api/axios';
import { photosBucketURL, supabase } from '@/api/supabase';
import { SignUpData, UserCredentials } from '@/model/user/types';
import apolloClient from '@/api/graphql';
import { GET_USER } from '@/graphql/queries';
import { GetReferral, GetUserPhotos, GetUserTasks } from '@/model/user/queries';
import { ReferralsDataResponse } from '@/app/api/referrals-data/route';
import {
	ADD_USER_PHOTO,
	CLAIM_FIRST_TASK, CLAIM_TASK,
	SYNCHRONIZE_TAPS,
	UPDATE_DAILY_REWARD_COMPLETED_DAYS
} from '@/graphql/mutations';
import { ClaimReferrals } from '@/model/user/mutations';
import { Level, levelToPhotoReward } from '@/constants';
import { PersonalizedTask } from '@/types/Task';

export const validateTelegramData = async (dataCheckString: string) => {
	console.log(process.env.NODE_ENV, 'here');
	return axios.post<ValidatedTelegramUser>('/check-telegram-data', {
		dataCheckString: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_MOCK_TG_DATA : dataCheckString
	});
}

export const signUp = (credentials: UserCredentials, signUpData: SignUpData) => supabase.auth.signUp({
	...credentials,
	options: {
		data: signUpData,
	}
});

export const signIn = (credentials: UserCredentials) => supabase.auth.signInWithPassword(credentials);

export const getUser = (id: string) => apolloClient.query({
	query: GET_USER,
	fetchPolicy: 'no-cache',
	variables: {
		id,
	},
});

export const getPhotos = (id: string) => apolloClient.query({
	query: GetUserPhotos,
	fetchPolicy: 'no-cache',
	variables: {
		userId: id,
	},
});

export const getUserTasks = (id: string) => apolloClient.query({
	query: GetUserTasks,
	fetchPolicy: 'no-cache',
	variables: {
		userId: id,
	},
});

export const getReferrals = (telegramId: string) => axios.post<ReferralsDataResponse>('/referrals-data', {
	telegramId,
});

export const updateDailyRewardCompletedDays = async (
	userId: string,
	userTaskId: string,
	completedDays: number,
) => {
	return apolloClient.mutate({
		mutation: UPDATE_DAILY_REWARD_COMPLETED_DAYS,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			userTaskId,
			completedDays,
		},
	});
}

export const getReferral = (telegramId: string) => apolloClient.query({
	query: GetReferral,
	fetchPolicy: 'no-cache',
	variables: {
		telegramId,
	}
});

export const getReferrerData = async (referrerId: string) => axiosInstance.post('/referral', {
	telegramId: referrerId,
});

export const claimReferrals = async (telegramId: string) => apolloClient.query({
	query: ClaimReferrals,
	fetchPolicy: 'no-cache',
	variables: {
		telegramId,
	}
});

export const uploadPhotoToBucket = (userId: string, photoId: string, photo: ArrayBuffer) => supabase.storage
	.from('photos')
	.upload(`${userId}/${photoId}`, photo, {
		contentType: 'image/jpeg',
	});

export const uploadPhoto = (userId: string, photoId: string, level: number, coins: number, lastPhoto: string) => apolloClient.mutate({
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

export const synchronizeTaps = (userId: string, coins: number, energy: number, lastSync: string) => apolloClient.mutate({
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
	userId: string,
	userTaskId?: string,
	taskId: string;
	daysCompleted: number,
	coins: number,
	isCompleted: boolean,
	lastDailyReward?: string | null,
}

export const claimFirstTask = (params: ClaimTaskParams) => apolloClient.mutate({
	mutation: CLAIM_FIRST_TASK,
	fetchPolicy: 'no-cache',
	variables: {
		userId: params.userId,
		taskId: params.taskId,
		lastDailyReward: params.lastDailyReward ?? null,
		daysCompleted: params.daysCompleted,
		coins: params.coins,
		completed: params.isCompleted,
	},
});

export const claimTask = (params: ClaimTaskParams) => apolloClient.mutate({
	mutation: CLAIM_TASK,
	fetchPolicy: 'no-cache',
	variables: {
		userId: params.userId,
		userTaskId: params.userTaskId!,
		lastDailyReward: params.lastDailyReward ?? null,
		daysCompleted: params.daysCompleted,
		coins: params.coins,
		completed: params.isCompleted,
	},
});
