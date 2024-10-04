import apolloClient from '@/api/graphql';
import { CoreUserFieldsFragment } from '@/gql/graphql';
import { SYNCHRONIZE_TAPS } from '@/graphql/mutations/tap';

import { REFER_USER, UPDATE_USER } from '@/graphql/mutations';

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

	return data;
}

export type referUserOptions = {
	referrerTgId: string;
	referralTgId: string;
	userId: string;
	coins: number;
	isUser: boolean;
};

export async function referUser({
	referrerTgId,
	referralTgId,
	userId,
	coins,
	isUser,
}: referUserOptions) {
	const { errors, data } = await apolloClient.mutate({
		mutation: REFER_USER,
		fetchPolicy: 'no-cache',
		variables: {
			referrerTgId,
			referralTgId,
			userId,
			coins,
			isUser,
		},
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
	lastDailyReward?: string | null;
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
		},
	});

	if (errors?.length) {
		throw new Error();
	}

	return data;
}
