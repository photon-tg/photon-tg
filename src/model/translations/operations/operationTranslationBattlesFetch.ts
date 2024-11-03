import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import { battleCurrentBattleIdSelector } from '@/model/battle/selectors';
import { getBattleContent } from '@/model/translations/services';
import { setTranslationBattles } from '@/model/translations/actions';
import { selectedLocaleSelector } from '@/model/translations/selectors';
import { Locales } from '@/constants/locales';

export interface TranslationBattlesFetchPayload {
	type: 'currentBattle';
}

export const operationTranslationBattlesFetch =
	createAction<TranslationBattlesFetchPayload>(
		'operation:translations/battles/fetch',
	);

export function* operationTranslationBattlesFetchWorker({
	payload,
}: PayloadAction<{ type: string }>) {
	const locale: Locales = yield select(selectedLocaleSelector);
	const { type } = payload;
	if (type === 'currentBattle') {
		// @ts-ignore
		const currentBattleId = yield select(battleCurrentBattleIdSelector);

		if (!currentBattleId) return;
		// @ts-ignore
		const data: any = yield call(getBattleContent, currentBattleId, locale);
		if (data) {
			yield put(setTranslationBattles(data));
		}
	}
}
