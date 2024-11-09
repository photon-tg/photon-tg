import { createAction } from '@reduxjs/toolkit';
import { minutesSinceUTCDate } from '@/utils/date';
import { put, select } from '@redux-saga/core/effects';
import { battleTimeLeftToJoinSet } from '@/model/battle/actions';
import { activeJoinBattleSelector } from '@/model/battle/selectors';
import { BattleFragment } from '@/gql/graphql';

export const operationBattleCalculateTimeToJoin = createAction(
	'operation:battle/timeLeftToJoin/calculate',
);

export function* operationBattleCalculateTimeToJoinWorker() {
	const currentBattle: BattleFragment = yield select(activeJoinBattleSelector);

	// @ts-ignore
	const minutesSinceStart = minutesSinceUTCDate(
		currentBattle.start_date as string,
	);
	const timeLeftToJoin = 1440 - minutesSinceStart;
	yield put(battleTimeLeftToJoinSet(timeLeftToJoin));
}
