import {
	operationTranslationBattlesFetch,
	operationTranslationBattlesFetchWorker,
} from '@/model/translations/operations/operationTranslationBattlesFetch';
import { takeEvery } from '@redux-saga/core/effects';
import {
	operationSelectLocale,
	operationSelectLocaleWorker,
} from '@/model/translations/operations/operationSelectLocale';
import {
	operationCommonTranslationsInit,
	operationCommonTranslationsInitWorker,
} from '@/model/translations/operations/operationCommonTranslationsInit';
import {
	operationTranslationsInit,
	operationTranslationsInitWorker,
} from '@/model/translations/operations/operationTranslationsInit';

function* translationsWatcher() {
	yield takeEvery(
		operationTranslationBattlesFetch.type,
		operationTranslationBattlesFetchWorker,
	);
	yield takeEvery(operationSelectLocale.type, operationSelectLocaleWorker);
	yield takeEvery(
		operationCommonTranslationsInit.type,
		operationCommonTranslationsInitWorker,
	);
	yield takeEvery(
		operationTranslationsInit.type,
		operationTranslationsInitWorker,
	);
}

export default translationsWatcher;
