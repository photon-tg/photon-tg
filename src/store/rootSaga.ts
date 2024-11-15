import { fork } from '@redux-saga/core/effects';
import userWatcher from '@/model/user/saga';
import applicationWatcher from '@/model/application/saga';
import battleWatcher from '@/model/battle/saga';

function* rootSaga() {
	yield fork(userWatcher);
	yield fork(applicationWatcher);
	yield fork(battleWatcher);
}

export default rootSaga;
