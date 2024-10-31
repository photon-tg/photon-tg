import {
	operationTranslationBattlesFetch,
	operationTranslationBattlesFetchWorker,
} from '@/model/translations/operations/operationTranslationBattlesFetch';
import { takeEvery } from '@redux-saga/core/effects';

function* translationsWatcher() {
	yield takeEvery(
		operationTranslationBattlesFetch.type,
		operationTranslationBattlesFetchWorker,
	);
}

export default translationsWatcher;
