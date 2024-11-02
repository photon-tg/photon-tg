import { createAction, PayloadAction } from '@reduxjs/toolkit';
import {
	getBattleLeaders,
	GetEntityResult,
	getPhotoLikes,
	getUserBattlePhoto,
} from '@/model/battle/services';
import { call, put, select } from '@redux-saga/core/effects';
import { battleSelectedBattleSet, battleTopSet } from '@/model/battle/actions';
import { BattlePhotoFragment, PhotoLikeFragment } from '@/gql/graphql';
import { userIdSelector } from '@/model/user/selectors';

export const operationBattleSelect = createAction<string>(
	'battle/battle/select',
);

export function* operationBattleSelectWorker({
	payload: battleId,
}: PayloadAction<string>) {
	const userId: string = yield select(userIdSelector);
	const userPhotoResponse: GetEntityResult<BattlePhotoFragment> = yield call(
		getUserBattlePhoto,
		battleId,
		userId,
	);

	if (userPhotoResponse.error) return;

	let userPhoto: undefined | (BattlePhotoFragment & { likes_count: number }) =
		undefined;

	if (userPhotoResponse.data) {
		const photoLikesResponse: GetEntityResult<number> = yield call(
			getPhotoLikes,
			userPhotoResponse.data.id,
		);

		userPhoto = {
			...userPhotoResponse.data,
			likes_count: photoLikesResponse.data ?? 0,
		};
	}

	const battleLeadersResponse: GetEntityResult<PhotoLikeFragment[]> =
		yield call(getBattleLeaders, battleId);

	if ('error' in battleLeadersResponse && battleLeadersResponse.error) return;

	// @ts-ignore
	yield put(battleTopSet({ battleId, top: battleLeadersResponse?.data }));
	const selectedBattle = {
		id: battleId,
		userPhoto,
		top: battleLeadersResponse.data,
	};
	// @ts-ignore
	yield put(battleSelectedBattleSet(selectedBattle));
}
