import apolloClient from '@/api/graphql';
import { GET_TASKS, GET_USER } from '@/graphql/queries';

import { AddUserPhotoMutation, CoreUserFieldsFragment } from '@/gql/graphql';
import {
	OmitTypenameAndUnwrapRecords,
	parseGraphQLMutationResponse,
	parseTasks,
} from '@/api/parsers';
import { PersonalizedTask } from '@/interfaces/Task';
import {
	CLAIM_DAILY_REWARD,
	CLAIM_FIRST_DAILY_REWARD,
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
import { ADD_USER_PHOTO } from '@/graphql/mutations';
import { Level, levelToPhotoReward } from '@/constants';

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
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return parseGraphQLMutationResponse(data);
}

export async function updatePassiveIncome(
	userId: string,
	coins: number,
	lastHourlyReward: string,
) {
	const { data, errors } = await apolloClient.mutate({
		mutation: UPDATE_PASSIVE_INCOME,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			coins,
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
): Promise<OmitTypenameAndUnwrapRecords<AddUserPhotoMutation>> {
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
			coins: levelToPhotoReward.get(level as Level) + coins,
		},
	});

	if (errors?.length || !data) {
		throw new Error();
	}

	return parseGraphQLMutationResponse(data);
}
