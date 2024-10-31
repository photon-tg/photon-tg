import { fork } from '@redux-saga/core/effects';
import userWatcher from '@/model/user/saga';
import applicationWatcher from '@/model/application/saga';
import battleWatcher from '@/model/battle/saga';
import translationsWatcher from '@/model/translations/saga';

function* rootSaga() {
	yield fork(userWatcher);
	yield fork(applicationWatcher);
	yield fork(battleWatcher);
	yield fork(translationsWatcher);
}

export default rootSaga;
