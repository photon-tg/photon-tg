import {
	CoreUserFieldsFragment,
	TaskFragment,
	UpdateDailyRewardCompletedDaysMutation,
	UserTaskFragment,
} from '@/gql/graphql';
import { call, put, select } from '@redux-saga/core/effects';
import { applicationTasksSelector } from '@/model/application/selectors';
import { userSelector, userTasksSelector } from '@/model/user/selectors';
import {
	userErrorSet,
	userLastDailyRewardSet,
	userTaskUpdate,
} from '@/model/user/actions';
import { daysSinceDate } from '@/utils/date';
import { FetchResult } from '@apollo/client';
import { updateDailyRewardCompletedDays } from '@/model/user/services';
import { UserErrorType } from '@/model/user/types';
import * as Sentry from '@sentry/nextjs';
import { createAction } from '@reduxjs/toolkit';

export const operationInitDailyReward = createAction(
	'operation:user/dailyRewards/init',
);

export function* operationInitDailyRewardWorker() {
	const tasks: TaskFragment[] = yield select(applicationTasksSelector);
	const user: CoreUserFieldsFragment = yield select(userSelector);
	const userTasks: UserTaskFragment[] = yield select(userTasksSelector);

	const dailyRewardTask = tasks.find((task) => task.id === 'daily_reward');
	const userDailyRewardTask = userTasks.find(
		(userTask) => userTask.task_id === dailyRewardTask?.id,
	);

	if (!userDailyRewardTask) return;

	try {
		const daysSinceLastDailyReward = user.last_daily_reward
			? daysSinceDate(user.last_daily_reward)
			: 0;

		const isLastClaimedRewardToday = daysSinceLastDailyReward < 1;
		const passedOnlyOneDay =
			daysSinceLastDailyReward === 1 && !userDailyRewardTask.completed;
		if (isLastClaimedRewardToday || passedOnlyOneDay) return;

		// user started daily quest but skipped day(s)
		const updateUserDailyRewardTaskResponse: FetchResult<UpdateDailyRewardCompletedDaysMutation> =
			yield call(
				updateDailyRewardCompletedDays,
				user.id,
				userDailyRewardTask.id!,
				false,
				0,
			);

		const updatedUserDailyRewardTask =
			updateUserDailyRewardTaskResponse.data?.updateuser_tasksCollection
				?.records?.[0];

		if (
			updateUserDailyRewardTaskResponse.errors?.length ||
			!updatedUserDailyRewardTask
		) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}

		yield put(userTaskUpdate(updatedUserDailyRewardTask));
		yield put(userLastDailyRewardSet(null));
	} catch (error) {
		Sentry.captureException(error, {
			contexts: {
				user,
			},
		});
	}
}
