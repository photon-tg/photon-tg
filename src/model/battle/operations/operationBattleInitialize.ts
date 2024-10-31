import { createAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import {
	getBattlePhotos,
	getBattles,
	GetEntityResult,
} from '@/model/battle/services';
import { BattleFragment, BattlePhotoFragment } from '@/gql/graphql';
import {
	battleActivePhotosSet,
	battleBattlesSet,
	battleCurrentBattlePhotosSet,
	battleCurrentIdSet,
	battleIsInitializedSet,
} from '@/model/battle/actions';
import shuffle from 'lodash/shuffle';
import { userIdSelector } from '@/model/user/selectors';
import { operationBattleSelect } from '@/model/battle/operations/operationBattleSelect';
import { operationBattleCalculateTimeToJoin } from '@/model/battle/operations/operationBattleCalculateTimeToJoin';
import { operationTranslationBattlesFetch } from '@/model/translations/operations/operationTranslationBattlesFetch';

export const operationBattleInitialize = createAction(
	'operation:battle/initialize',
);

export function* operationBattleInitializeWorker() {
	const userId: string = yield select(userIdSelector);
	const battlesResponse: GetEntityResult<BattleFragment[]> =
		yield call(getBattles);

	if (battlesResponse.error) return;

	const currentBattle = battlesResponse.data.find(({ is_active }) => is_active);

	if (!currentBattle) return;

	yield put(battleBattlesSet(battlesResponse.data));
	yield put(battleCurrentIdSet(currentBattle.id));

	const photosResponse: GetEntityResult<BattlePhotoFragment[]> = yield call(
		getBattlePhotos,
		userId,
		currentBattle.id,
	);

	if (photosResponse.error) return;

	yield put(operationTranslationBattlesFetch({ type: 'currentBattle' }));

	const shuffledPhotos = shuffle(photosResponse.data);
	const [first, second] = shuffledPhotos;
	yield put(battleCurrentBattlePhotosSet(shuffledPhotos));
	yield put(battleActivePhotosSet([first, second]));
	yield put(operationBattleSelect(currentBattle.id));

	yield put(operationBattleCalculateTimeToJoin());
	yield put(battleIsInitializedSet(true));
}
