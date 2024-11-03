import { createAction } from '@reduxjs/toolkit';
import {
	GetEntityResult,
	getNotClaimedPhotoLikes,
} from '@/model/battle/services';
import { call, put, select } from '@redux-saga/core/effects';
import { BattlePhotoFragment, CoreUserFieldsFragment } from '@/gql/graphql';
import {
	userCoinsSelector,
	userPhotosSelector,
	userSelector,
} from '@/model/user/selectors';
import { getUserLevel, Level, levelToReceiveLikeReward } from '@/constants';
import { updateUser } from '@/model/user/services';
import { userCoinsAdd, userLastLikesClaimSet } from '@/model/user/actions';

export const operationPhotoLikesCoinsReceive = createAction(
	'operation:user/photos/likes/receive',
);

export function* operationPhotoLikesCoinsReceiveWorker() {
	const photos: BattlePhotoFragment[] = yield select(userPhotosSelector);
	const photoIds = photos.map(({ id }) => id);
	const user: CoreUserFieldsFragment = yield select(userSelector);
	const level = getUserLevel(user.coins);

	const likesResponse: GetEntityResult<number | null> = yield call(
		getNotClaimedPhotoLikes,
		photoIds,
		user.last_likes_claim,
	);
	if ('error' in likesResponse) {
		return;
	}

	const likesCount = likesResponse.data || 0;
	// TODO: redo
	const award = likesCount * levelToReceiveLikeReward.get(level as Level)!;

	if (award <= 0) return;

	yield put(userCoinsAdd(award));
	yield put(userLastLikesClaimSet(new Date().toUTCString()));
}
