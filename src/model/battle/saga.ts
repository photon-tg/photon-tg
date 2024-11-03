import {
	call,
	fork,
	put,
	select,
	take,
	takeEvery,
	takeLeading,
} from '@redux-saga/core/effects';
import {
	operationBattleInitialize,
	operationBattleInitializeWorker,
} from '@/model/battle/operations/operationBattleInitialize';
import {
	operationBattlePhotoSelect,
	operationBattlePhotoSelectWorker,
} from '@/model/battle/operations/operationBattlePhotoSelect';
import {
	operationBattlePhotoLike,
	operationBattlePhotoLikeWorker,
} from '@/model/battle/operations/operationBattlePhotoLike';
import {
	operationBattleSelect,
	operationBattleSelectWorker,
} from '@/model/battle/operations/operationBattleSelect';
import {
	operationBattleCalculateTimeToJoin,
	operationBattleCalculateTimeToJoinWorker,
} from '@/model/battle/operations/operationBattleCalculateTimeToJoin';

import {
	operationBattleTimeUpdate,
	operationBattleTimeUpdateWorker,
} from '@/model/battle/operations/operationBattleTimeUpdate';
import { BattleFragment } from '@/gql/graphql';
import { battleCurrentBattleSelector } from '@/model/battle/selectors';

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function* battleTimeWatcher() {
	while (true) {
		const currentBattle: BattleFragment = yield select(
			battleCurrentBattleSelector,
		);
		yield put(operationBattleTimeUpdate());
		if (currentBattle?.id) {
			yield put(operationBattleSelect(currentBattle.id));
		}

		yield call(delay, 60000);
	}
}

function* battleWatcher() {
	yield fork(battleTimeWatcher);
	yield takeLeading(
		operationBattleInitialize.type,
		operationBattleInitializeWorker,
	);
	yield takeEvery(
		operationBattlePhotoSelect.type,
		operationBattlePhotoSelectWorker,
	);
	yield takeEvery(
		operationBattlePhotoLike.type,
		operationBattlePhotoLikeWorker,
	);
	yield takeEvery(operationBattleSelect.type, operationBattleSelectWorker);
	yield takeEvery(
		operationBattleCalculateTimeToJoin.type,
		operationBattleCalculateTimeToJoinWorker,
	);
	yield takeEvery(
		operationBattleTimeUpdate.type,
		operationBattleTimeUpdateWorker,
	);
}

export default battleWatcher;
