import { createAction } from '@reduxjs/toolkit';
import { addHoursToDate, minutesSinceUTCDate } from '@/utils/date';
import { BattleFragment } from '@/gql/graphql';
import { call, put, select } from '@redux-saga/core/effects';
import {
	activeJoinBattleSelector,
	activeVoteBattleSelector,
} from '@/model/battle/selectors';
import { battleTimeLeftToVoteSet } from '@/model/battle/actions';
import { operationBattleCalculateTimeToJoin } from '@/model/battle/operations/operationBattleCalculateTimeToJoin';

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
	const activeVoteBattle: BattleFragment = yield select(
		activeVoteBattleSelector,
	);
	const activeJoinBattle: BattleFragment = yield select(
		activeJoinBattleSelector,
	);

	if (activeJoinBattle) {
		yield put(operationBattleCalculateTimeToJoin());
	}

	if (activeVoteBattle) {
		const endDate = addHoursToDate(activeVoteBattle.start_date, 24);
		const timeLeftToVote: {
			formattedHours: string;
			formattedMinutes: string;
			// @ts-ignore
		} = yield call(getTimeLeftForVoting, endDate.toUTCString());

		yield put(battleTimeLeftToVoteSet(timeLeftToVote));
	}
}
