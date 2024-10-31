import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import { battleCurrentBattleIdSelector } from '@/model/battle/selectors';
import { getBattleContent } from '@/model/translations/services';
import { setTranslationBattles } from '@/model/translations/actions';

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
	const { type } = payload;

	if (type === 'currentBattle') {
		// @ts-ignore
		const currentBattleId = yield select(battleCurrentBattleIdSelector);
		// @ts-ignore
		const data: any = yield call(getBattleContent, currentBattleId);
		if (data) {
			yield put(setTranslationBattles(data));
		}
	}
}
