import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import {
	battleIsAnimatingSet,
	battleMessageContentSet,
} from '@/model/battle/actions';
import { likePhoto, viewPhotos } from '@/model/battle/services';
import {
	userCoinsSelector,
	userIdSelector,
	userSelector,
} from '@/model/user/selectors';
import { battleIdSelector } from '@/model/battle/selectors';
import {
	getUserLevel,
	levelToSelectEnergyReduction,
	levelToSelectReward,
} from '@/constants';
import { User } from '@/types/User';
import { updateUser } from '@/model/user/services';
import { userCoinsAdd, userEnergyReduce } from '@/model/user/actions';

export type operationBattlePhotoSelectPayload = {
	selectedPhotoId: string;
	otherPhotoId: string;
};

export const operationBattlePhotoSelect =
	createAction<operationBattlePhotoSelectPayload>(
		'operation:battle/photo/select',
	);

export function* operationBattlePhotoSelectWorker({
	payload,
}: PayloadAction<operationBattlePhotoSelectPayload>) {
	yield put(battleIsAnimatingSet(true));

	const user: User = yield select(userSelector);
	const battleId: string = yield select(battleIdSelector);
	const userLevel = getUserLevel(user.coins);
	const selectReward = levelToSelectReward.get(userLevel)!;
	const selectEnergyReduction = levelToSelectEnergyReduction.get(userLevel)!;

	const energyReduced = user.energy - selectEnergyReduction;
	if (energyReduced < 0) {
		yield put(
			battleMessageContentSet({
				title: 'Not enough energy to vote',
				description: 'Wait for some time for it to recover',
			}),
		);
		return;
	}

	yield call(likePhoto, user.id, payload.selectedPhotoId);
	yield call(viewPhotos, user.id, battleId, [
		payload.selectedPhotoId,
		payload.otherPhotoId,
	]);

	yield call(updateUser, {
		user,
		coins: user.coins + selectReward,
		energy: user.energy - selectEnergyReduction,
	});
	yield put(userCoinsAdd(selectReward));
	yield put(userEnergyReduce(selectEnergyReduction));
}
