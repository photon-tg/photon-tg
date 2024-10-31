import { createAction } from '@reduxjs/toolkit';
import { minutesSinceUTCDate } from '@/utils/date';
import { put, select } from '@redux-saga/core/effects';
import {
	battleCanJoinSet,
	battleTimeLeftToJoinSet,
} from '@/model/battle/actions';
import { battleCurrentBattleSelector } from '@/model/battle/selectors';
import { BattleFragment } from '@/gql/graphql';

export const operationBattleCalculateTimeToJoin = createAction(
	'operation:battle/timeLeftToJoin/calculate',
);

export function* operationBattleCalculateTimeToJoinWorker() {
	const currentBattle: BattleFragment = yield select(
		battleCurrentBattleSelector,
	);
	const minutesSinceStart = minutesSinceUTCDate(currentBattle.start_date);
	const isFirstHalf = minutesSinceStart < 720;
	const timeLeftToJoin = isFirstHalf
		? 720 - minutesSinceStart
		: 1440 - minutesSinceStart;
	const canJoin = isFirstHalf;

	yield put(battleCanJoinSet(canJoin));
	yield put(battleTimeLeftToJoinSet(timeLeftToJoin));
}
