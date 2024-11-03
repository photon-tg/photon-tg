import { createAction } from '@reduxjs/toolkit';
import { minutesSinceUTCDate } from '@/utils/date';
import { BattleFragment } from '@/gql/graphql';
import { call, put, select } from '@redux-saga/core/effects';
import { battleCurrentBattleSelector } from '@/model/battle/selectors';
import {
	battleCanJoinSet,
	battleTimeLeftToJoinSet,
	battleTimeLeftToVoteSet,
} from '@/model/battle/actions';

const getTimeLeftForVoting = (
	endDate?: string,
): {
	formattedHours: string;
	formattedMinutes: string;
} => {
	const now = new Date();

	// Calculate the difference in milliseconds
	const timeDiff = new Date(endDate ?? '').getTime() - now.getTime();

	// If the time difference is negative, it means the end date has passed
	if (timeDiff <= 0) {
		return { formattedHours: '0', formattedMinutes: '0' };
	}

	// Convert the time difference from milliseconds to minutes
	const totalMinutes = Math.floor(timeDiff / (1000 * 60));

	// Calculate hours and remaining minutes
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	// Format hours and minutes as hh:mm
	const formattedHours = hours.toString();
	const formattedMinutes = minutes.toString();

	return { formattedHours, formattedMinutes };
};

export const operationBattleTimeUpdate = createAction(
	'operation:battle/time/update',
);

export function* operationBattleTimeUpdateWorker() {
	console.log('clall');

	const currentBattle: BattleFragment = yield select(
		battleCurrentBattleSelector,
	);
	if (!currentBattle) return;

	const minutesSinceStart = minutesSinceUTCDate(currentBattle.start_date);
	const isFirstHalf = minutesSinceStart < 720;
	const timeLeftToJoin = isFirstHalf
		? 720 - minutesSinceStart
		: 1440 - minutesSinceStart;
	const canJoin = isFirstHalf;

	yield put(battleCanJoinSet(canJoin));
	yield put(battleTimeLeftToJoinSet(timeLeftToJoin));

	const timeLeftToVote: {
		formattedHours: string;
		formattedMinutes: string;
	} = yield call(getTimeLeftForVoting, currentBattle.end_date);

	yield put(battleTimeLeftToVoteSet(timeLeftToVote));
}
