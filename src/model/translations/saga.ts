import {
	operationTranslationBattlesFetch,
	operationTranslationBattlesFetchWorker,
} from '@/model/translations/operations/operationTranslationBattlesFetch';
import { takeEvery } from '@redux-saga/core/effects';
import {
	operationSelectLocale,
	operationSelectLocaleWorker,
} from '@/model/translations/operations/operationSelectLocale';

function* translationsWatcher() {
	yield takeEvery(
		operationTranslationBattlesFetch.type,
		operationTranslationBattlesFetchWorker,
	);
	yield takeEvery(operationSelectLocale.type, operationSelectLocaleWorker);
}

export default translationsWatcher;
