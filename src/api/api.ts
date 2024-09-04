import apolloClient from '@/api/graphql';
import { GET_REFERRED, GET_TASKS, GET_USER, GetUserData } from '@/graphql/queries';

import { CoreUserFieldsFragment, ReferralFragment, UserPhotoFragment } from '@/gql/graphql';
import {
	parseGraphQLMutationResponse,
	parseTasks,
} from '@/api/parsers';
import { PersonalizedTask } from '@/interfaces/Task';
import {
	CLAIM_DAILY_REWARD,
	CLAIM_FIRST_DAILY_REWARD,
	CLAIM_FIRST_TASK, CLAIM_TASK,
	UPDATE_DAILY_REWARD_COMPLETED_DAYS,
} from '@/graphql/mutations/task';
import {
	SYNCHRONIZE_TAPS,
	UPDATE_PASSIVE_INCOME,
} from '@/graphql/mutations/tap';
import { GET_USER_PHOTOS } from '@/graphql/queries/photo';
import { UserPhoto } from '@/interfaces/photo';
import { photosBucketURL, supabase } from './supabase';
import { decode } from 'base64-arraybuffer';
import { nanoid } from 'nanoid';
import { ADD_USER_PHOTO, CLAIM_REFERRAL, REFER_USER, UPDATE_USER } from '@/graphql/mutations';
import { Level, levelToPhotoReward } from '@/constants';
import { axiosInstance } from '@/api/axios';
import { Referral } from '@/contexts/ApplicationContext/hooks/useReferrals/useReferrals';
import { User } from '@/interfaces/User';

export async function getUser(
	userId: string,
): Promise<CoreUserFieldsFragment | undefined> {
	const { error, data } = await apolloClient.query({
		query: GET_USER,
		fetchPolicy: 'no-cache',
		variables: {
			id: userId,
		},
	});

	if (error) {
		throw new Error();
	}

	return data.usersCollection?.edges[0].node;
}

export async function getTasks(
	userId: string,
): Promise<PersonalizedTask[] | undefined> {
	const { error, data } = await apolloClient.query({
		query: GET_TASKS,
		fetchPolicy: 'no-cache',
		variables: {
			id: userId,
		},
	});

	if (error || !data) {
		throw new Error();
	}

	return parseTasks(data.tasksCollection, data.user_tasksCollection);
}

export async function updateDailyRewardCompletedDays(
	userId: string,
	userTaskId: string,
	completedDays: number,
) {
	const { errors, data } = await apolloClient.mutate({
		mutation: UPDATE_DAILY_REWARD_COMPLETED_DAYS,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			userTaskId,
			completedDays,
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return;
}

export async function claimDailyReward(
	userId: string,
	taskId: string,
	userTaskId: string | undefined,
	daysCompleted: number,
	rewardCoins: number,
	coins: number,
) {
	const { data, errors } = await apolloClient.mutate({
		mutation: userTaskId ? CLAIM_DAILY_REWARD : CLAIM_FIRST_DAILY_REWARD,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			taskId,
			userTaskId: userTaskId as string,
			lastDailyReward: new Date().toISOString(),
			daysCompleted,
			coins: coins + rewardCoins,
			completed: daysCompleted === 10,
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return parseGraphQLMutationResponse(data);
}

export type ClaimTaskParams = {
	userId: string,
	userTaskId?: string,
	taskId: string;
	daysCompleted: number,
	coins: number,
	isCompleted: boolean,
	lastDailyReward?: string | null,
}

export async function claimFirstTask(params: ClaimTaskParams): Promise<PersonalizedTask> {
	const { data, errors } = await apolloClient.mutate({
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

	if (errors?.length || !data) {
		throw new Error();
	}

	const fullTask = data.insertIntouser_tasksCollection?.records[0];

	if (!fullTask) {
		throw new Error();
	}

	const task = fullTask.tasks;

	return {
		...task,
		userTask: fullTask,
	};
}

export async function claimTask(params: ClaimTaskParams): Promise<PersonalizedTask> {
	const { data, errors } = await apolloClient.mutate({
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


	if (errors?.length || !data) {
		throw new Error();
	}

	const fullTask = data.updateuser_tasksCollection.records[0];
	const task = fullTask.tasks;

	return {
		...task,
		userTask: fullTask,
	};
}



export async function synchronizeTaps(
	userId: string,
	coins: number,
	energy: number,
) {
	const { data, errors } = await apolloClient.mutate({
		mutation: SYNCHRONIZE_TAPS,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			coins,
			energy,
			lastSync: new Date().toUTCString(),
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return parseGraphQLMutationResponse(data);
}

export async function updatePassiveIncome(
	userId: string,
	lastHourlyReward: string,
) {
	const { data, errors } = await apolloClient.mutate({
		mutation: UPDATE_PASSIVE_INCOME,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			lastHourlyReward,
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return data;
}

export async function getUserPhotos(userId: string): Promise<UserPhoto[]> {
	const { error, data } = await apolloClient.query({
		query: GET_USER_PHOTOS,
		variables: {
			userId,
		},
	});

	if (error) {
		throw new Error();
	}

	const parsedPhotos = data.user_photosCollection?.edges.map(
		({ node: photo }) => {
			return {
				...photo,
			};
		},
	);

	return parsedPhotos ?? [];
}

export async function postUserPhoto(
	userId: string,
	imageBase64: string,
	level: number,
	coins: number,
): Promise<{ photo: UserPhotoFragment | undefined }> {
	const image = decode(imageBase64.split('base64,')[1]);

	const imageId = nanoid();
	const { error: bucketError, data: bucketData } = await supabase.storage
		.from('photos')
		.upload(`${userId}/${imageId}`, image, {
			contentType: 'image/jpeg',
		});

	if (bucketError || !bucketData?.id) {
		throw new Error();
	}

	const { errors, data } = await apolloClient.mutate({
		mutation: ADD_USER_PHOTO,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			photoId: imageId,
			currentLevel: level,
			url: `${photosBucketURL}/${userId}/${imageId}`,
			lastPhoto: new Date().toUTCString(),
			coins: (levelToPhotoReward.get(level as Level) as number) + coins,
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return {
		photo: data.insertIntouser_photosCollection?.records?.[0],
	}
}

export async function getReferral(userTgId: string) {
	const { error, data} = await apolloClient.query({
		query: GET_REFERRED,
		fetchPolicy: 'no-cache',
		variables: {
			userTgId,
		}
	});

	if (error || !data) {
		throw new Error();
	}

	return data.user_referralsCollection?.edges?.[0]?.node;
}

export async function getFriend(friendTgId: string): Promise<{ is_premium: boolean }> {
	const { data } = await axiosInstance.post('/referral', {
		telegramId: friendTgId,
	});

	return data;
}

export async function getReferrerInfo(tgId: string): Promise<any[]> {
	const { data: referralsData } = await axiosInstance.get(`/referrals?referrer=${tgId}`);

	return referralsData as Referral[];
}

export async function getReferrals(tgId: string): Promise<any[]> {
	const { data: referralsData } = await axiosInstance.post(`/referrals?referral=${tgId}`);

	return referralsData as Referral[];
}

export type Friend = {
	first_name: string;
	last_name: string;
	coins: number;
	is_premium: boolean;
	is_claimed_by_referrer: boolean;
}

export async function getFriends(telegramId: string): Promise<Friend[]> {
	const { data } = await axiosInstance.post('/friends', {
		telegram_id: telegramId,
	}, {
		withCredentials: true,
	});
	if (!data) {
		return []
	}

	return data;
}

export type referUserOptions = {
	referrerTgId: string;
	referralTgId: string;
}

export async function referUser({
	referrerTgId,
	referralTgId,
}: referUserOptions) {
	const { errors, data } = await apolloClient.mutate({
		mutation: REFER_USER,
		fetchPolicy: 'no-cache',
		variables: {
			referrerTgId,
			referralTgId,
		}
	});

	if (errors?.length) {
		throw new Error();
	}

	return data;
}

export async function claimReferrals(telegramId: string) {
	const { errors, data } = await apolloClient.mutate({
		mutation: CLAIM_REFERRAL,
		fetchPolicy: 'no-cache',
		variables: {
			telegramId,
		}
	});

	if (errors?.length) {
		throw new Error();
	}

	return data;
}

export type UpdateUserOptions = {
	userId?: string;
	coins?: number;
	lastHourlyReward?: string;
	user: User;
	isReferred?: boolean;
}

export async function updateUser({ userId, coins, lastHourlyReward, user, isReferred }: UpdateUserOptions) {
	const { errors, data } = await apolloClient.mutate({
		mutation: UPDATE_USER,
		fetchPolicy: 'no-cache',
		variables: {
			userId: userId ?? user.id,
			coins: coins ?? user.coins,
			lastHourlyReward: lastHourlyReward ?? user.last_hourly_reward,
			isReferred: isReferred ?? user.is_referred,
		}
	});

	if (errors?.length) {
		throw new Error();
	}

	return data;
}

export async function getUserData(userId: string, telegramId: string) {
	const { error, data } = await apolloClient.query({
		query: GetUserData,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			telegramId,
		}
	});

	if (error) {
		throw new Error();
	}

	const photos: UserPhoto[] | undefined = data.user_photosCollection?.edges.map(({ node: photo }) => {
		return photo;
	});

	const tasks: PersonalizedTask[] | undefined = data.tasksCollection?.edges.map(({ node: task }) => {
		const userTask = data.user_tasksCollection?.edges.find(({ node: userTask }) => userTask.task_id === task.id)?.node;
		console.log(data);
		return {
			...task,
			userTask,
		}
	});

	const referrals: ReferralFragment[] | undefined = data.user_referralsCollection?.edges.map(({ node: referral }) => {
		return referral;
	});

	const friends = referrals?.filter((friend) => friend.referrer_id === telegramId);
	const referred = referrals?.filter((referral) => referral.referral_id === telegramId)?.[0];

	return {
		photos,
		tasks,
		friends,
		referred,
	}
}
