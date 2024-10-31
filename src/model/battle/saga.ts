import { takeEvery, takeLeading } from '@redux-saga/core/effects';
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

function* battleWatcher() {
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
}

export default battleWatcher;
