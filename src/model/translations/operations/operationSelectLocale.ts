import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { put } from '@redux-saga/core/effects';
import { selectedLocaleSet } from '@/model/translations/actions';
import { operationTranslationBattlesFetch } from '@/model/translations/operations/operationTranslationBattlesFetch';
import { Locales } from '@/constants/locales';

export const operationSelectLocale = createAction<Locales>(
	'operation:translations/selectedLocale/select',
);

export function* operationSelectLocaleWorker({
	payload: locale,
}: PayloadAction<Locales>) {
	yield put(selectedLocaleSet(locale));
	yield put(operationTranslationBattlesFetch({ type: 'currentBattle' }));
}
