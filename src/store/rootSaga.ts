import { fork } from '@redux-saga/core/effects';
import userWatcher from '@/model/user/saga';
import applicationWatcher from '@/model/application/saga';

function* rootSaga() {
	yield fork(userWatcher);
	yield fork(applicationWatcher);
}

export default rootSaga;
