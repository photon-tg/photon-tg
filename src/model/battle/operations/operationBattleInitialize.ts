import { createAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import {
	getBattlePhotos,
	getBattles,
	GetEntityResult,
	getLastBattles,
	getUserBattlePhoto,
} from '@/model/battle/services';
import { BattleFragment, BattlePhotoFragment } from '@/gql/graphql';
import {
	activeJoinBattleIdSet,
	activeVoteBattleIdSet,
	battleActivePhotosSet,
	battleBattlesSet,
	battleCurrentBattlePhotosSet,
	battleCurrentIdSet,
	battleHasJoinedSet,
	battleIsInitializedSet,
} from '@/model/battle/actions';
import shuffle from 'lodash/shuffle';
import { userIdSelector } from '@/model/user/selectors';
import { operationBattleSelect } from '@/model/battle/operations/operationBattleSelect';
import { operationBattleCalculateTimeToJoin } from '@/model/battle/operations/operationBattleCalculateTimeToJoin';
import { operationBattleTimeUpdate } from '@/model/battle/operations/operationBattleTimeUpdate';

export const operationBattleInitialize = createAction(
	'operation:battle/initialize',
);

export function* operationBattleInitializeWorker() {
	yield put(battleIsInitializedSet(true));
	const userId: string = yield select(userIdSelector);
	const battlesResponse: GetEntityResult<BattleFragment[]> =
		yield call(getBattles);

	if (battlesResponse.error) return;

	const currentBattles = battlesResponse.data.filter(
		({ is_active }) => is_active,
	);

	if (currentBattles?.length < 1) return;

	let activeJoinBattleId: string | undefined = undefined;
	let activeVoteBattleId: string | undefined = undefined;

	if (currentBattles.length === 1) {
		const activeBattle = currentBattles[0];

		switch (activeBattle.stage) {
			case 'join':
				activeJoinBattleId = activeBattle.id;
				break;
			case 'vote':
				activeVoteBattleId = activeBattle.id;
				break;
			case 'join_vote':
				activeJoinBattleId = activeBattle.id;
				activeVoteBattleId = activeBattle.id;
				break;
		}
	}

	if (currentBattles.length === 2) {
		const firstActiveBattle = currentBattles[0];
		const secondActiveBattle = currentBattles[1];

		switch (firstActiveBattle.stage) {
			case 'join':
				activeJoinBattleId = firstActiveBattle.id;
				break;
			case 'vote':
				activeVoteBattleId = firstActiveBattle.id;
				break;
			case 'join_vote':
				activeJoinBattleId = firstActiveBattle.id;
				activeVoteBattleId = firstActiveBattle.id;
				break;
		}

		switch (secondActiveBattle.stage) {
			case 'join':
				activeJoinBattleId = secondActiveBattle.id;
				break;
			case 'vote':
				activeVoteBattleId = secondActiveBattle.id;
				break;
			case 'join_vote':
				activeJoinBattleId = secondActiveBattle.id;
				activeVoteBattleId = secondActiveBattle.id;
				break;
		}
	}

	yield put(battleBattlesSet(battlesResponse.data));
	yield put(activeVoteBattleIdSet(activeVoteBattleId as string));
	yield put(activeJoinBattleIdSet(activeJoinBattleId as string));

	if (activeVoteBattleId) {
		const photosResponse: GetEntityResult<BattlePhotoFragment[]> = yield call(
			getBattlePhotos,
			userId,
			activeVoteBattleId as string,
		);
		if (photosResponse.error) return;

		const shuffledPhotos = shuffle(photosResponse.data);
		const [first, second] = shuffledPhotos;
		yield put(battleCurrentBattlePhotosSet(shuffledPhotos));
		yield put(battleActivePhotosSet([first, second]));
		yield put(operationBattleSelect(activeVoteBattleId as string));
		yield put(operationBattleCalculateTimeToJoin());

		const userPhotoResponse: GetEntityResult<BattlePhotoFragment> = yield call(
			getUserBattlePhoto,
			activeVoteBattleId as string,
			userId,
		);
		if (!userPhotoResponse.error && !!userPhotoResponse?.data?.id) {
			put(battleHasJoinedSet(true));
		}
	}

	yield put(operationBattleTimeUpdate());
	yield put(battleIsInitializedSet(true));
}
