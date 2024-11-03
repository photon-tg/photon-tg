import { createAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import { getCommonTranslations } from '@/model/translations/services';
import { Locales } from '@/constants/locales';
import { selectedLocaleSelector } from '@/model/translations/selectors';
import { translationsCommonTranslationsSet } from '@/model/translations/actions';

export const operationCommonTranslationsInit = createAction(
	'operation:translations/commonTranslations/init',
);

export function* operationCommonTranslationsInitWorker() {
	const locale: Locales = yield select(selectedLocaleSelector);
	// @ts-ignore
	const data: any = yield call(getCommonTranslations, locale);
	if (!data) return;
	yield put(translationsCommonTranslationsSet(data));
}
