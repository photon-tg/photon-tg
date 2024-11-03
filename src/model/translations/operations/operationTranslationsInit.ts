import { createAction } from '@reduxjs/toolkit';
import { call, put, take } from '@redux-saga/core/effects';
import { getCommonTranslations } from '@/model/translations/services';
import { operationCommonTranslationsInit } from '@/model/translations/operations/operationCommonTranslationsInit';
import {
	translationsCommonTranslationsSet,
	translationsIsInitializedSet,
} from '@/model/translations/actions';

export const operationTranslationsInit = createAction(
	'operation:translations/init',
);

export function* operationTranslationsInitWorker() {
	yield put(operationCommonTranslationsInit());
	yield take(translationsCommonTranslationsSet.type);
	yield put(translationsIsInitializedSet(true));
}
