import apolloClient from '@/api/graphql';
import {
	GetBattles,
	GetLastBattles,
	GetUserBattlePhotos,
} from '@/model/battle/queries';
import { parseNodes } from '@/utils/graphql';
import {
	BattleFragment,
	BattlePhotoFragment,
	PhotoLikeFragment,
} from '@/gql/graphql';
import { supabase } from '@/api/supabase';
import {
	AddBattlePhoto,
	LikePhoto,
	ViewPhotos,
} from '@/model/battle/mutations';
import { Level } from '@/constants';

export type GetEntityResult<T> =
	| {
			error: true;
			data?: undefined;
	  }
	| {
			error?: false;
			data: T;
	  };

export const getBattles = async (): Promise<
	GetEntityResult<BattleFragment[]>
> => {
	const response = await apolloClient.query({
		query: GetBattles,
		fetchPolicy: 'no-cache',
	});

	const data = parseNodes(response.data.battlesCollection?.edges ?? []);

	if (response.errors?.length) {
		return {
			error: true,
		};
	}

	return { data };
};

export const getLastBattles = async (): Promise<
	GetEntityResult<BattleFragment[]>
> => {
	const response = await apolloClient.query({
		query: GetLastBattles,
		fetchPolicy: 'no-cache',
	});

	const data = parseNodes(response.data.battlesCollection?.edges ?? []);

	if (response.errors?.length) {
		return {
			error: true,
		};
	}

	return { data };
};

export const getBattlePhotos = async (
	userId: string,
	battleId: string,
): Promise<GetEntityResult<BattlePhotoFragment[]>> => {
	const { data, error } = await supabase.rpc('get_unseen_photos', {
		p_user_id: userId,
		p_battle_id: battleId,
	});

	if (error) {
		console.error('Error fetching unseen photos:', error);
		return {
			error: true,
		};
	}

	return {
		error: false,
		// @ts-ignore
		data: data.filter(({ user_id }) => user_id !== userId),
	};
	// const response = await apolloClient.query({
	// 	query: GetBattlePhotos,
	// 	fetchPolicy: 'no-cache',
	// 	variables: {
	// 		battleId,
	// 	}
	// });
	//
	// const data = parseNodes(response.data.battle_photosCollection?.edges ?? []);
	// if (response.errors?.length) {
	// 	return {
	// 		error: true,
	// 	}
	// }
	//
	// return { data };
};

export const getUserBattlePhoto = async (
	battleId: string,
	userId: string,
): Promise<GetEntityResult<BattlePhotoFragment | undefined>> => {
	const response = await apolloClient.query({
		query: GetUserBattlePhotos,
		fetchPolicy: 'no-cache',
		variables: {
			battleId,
			userId,
		},
	});

	const data = response.data.battle_photosCollection?.edges[0]?.node;
	if (response.errors?.length) {
		return {
			error: true,
		};
	}

	return { error: false, data };
};

export const getBattleLeaders = async (
	battleId: string,
): Promise<GetEntityResult<PhotoLikeFragment[]>> => {
	const response = await supabase.rpc('get_top_photos_by_likes', {
		p_battle_id: battleId,
		p_limit: 100,
		p_offset: 0,
	});

	if (response.error || !response.data) {
		return {
			error: true,
		};
	}

	return { data: response.data };
};

export const getPhotoLikes = async (
	photoId: string,
): Promise<GetEntityResult<number | null>> => {
	const response = await supabase
		.from('photo_likes')
		.select('*', { head: true, count: 'estimated' })
		.eq('photo_id', photoId);

	if (response.error) {
		return {
			error: true,
		};
	}

	return { data: response.count };
};

export const getNotClaimedPhotoLikes = async (
	photoIds: string[],
	lastClaimed?: string | null,
): Promise<GetEntityResult<number | null>> => {
	const query = supabase
		.from('photo_likes')
		.select('*', { head: true, count: 'estimated' })
		.in('photo_id', photoIds);

	if (lastClaimed) {
		query.gt('created_at', lastClaimed);
	}

	const response = await query;

	console.log(response);

	if (response.error) {
		return {
			error: true,
		};
	}

	return { data: response.count || 0 };
};

export const likePhoto = async (userId: string, photoId: string) => {
	const response = await apolloClient.mutate({
		mutation: LikePhoto,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			photoId,
		},
	});
};

export const viewPhotos = async (
	userId: string,
	battleId: string,
	photoIds: string[],
) => {
	const objects = photoIds.map((photoId) => ({
		photo_id: photoId,
		user_id: userId,
		battle_id: battleId,
	}));
	const response = await apolloClient.mutate({
		mutation: ViewPhotos,
		fetchPolicy: 'no-cache',
		variables: {
			objects,
		},
	});
};

export const uploadPhotoToBucket = (
	userId: string,
	battleId: string,
	photoId: string,
	photo: ArrayBuffer,
) =>
	supabase.storage
		.from('battle_photos')
		.upload(`${userId}/${battleId}--${photoId}`, photo, {
			contentType: 'image/jpeg',
		});

export interface UploadPhotoParams {
	userId: string;
	battleId?: string;
	level: Level;
	coins: number;
	url: string;
}

export const uploadPhoto = ({
	url,
	battleId,
	coins,
	userId,
	level,
}: UploadPhotoParams) =>
	apolloClient.mutate({
		mutation: AddBattlePhoto,
		fetchPolicy: 'no-cache',
		variables: {
			userId,
			battleId,
			lastPhoto: new Date().toISOString(),
			userLevel: level,
			url,
			coins,
		},
	});
