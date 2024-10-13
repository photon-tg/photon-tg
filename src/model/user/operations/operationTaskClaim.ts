import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import {
	ClaimFirstTaskMutation,
	ClaimTaskMutation,
	CoreUserFieldsFragment,
	TaskFragment,
	UserTaskFragment,
} from '@/gql/graphql';
import { userDataSelector, userSelector } from '@/model/user/selectors';
import {
	claimFirstTask,
	claimTask,
	ClaimTaskParams,
} from '@/model/user/services';
import { FetchResult } from '@apollo/client';
import { userSet, userTaskUpdate } from '@/model/user/actions';
import { claimTaskHelper } from '@/model/user/utils';
import * as Sentry from '@sentry/nextjs';
import { TaskType } from '@/types/Task';

export interface ClaimTaskPayload {
	type: TaskType;
	task: TaskFragment;
	userTask?: UserTaskFragment;
}

export const operationTaskClaim = createAction<ClaimTaskPayload>(
	'operation:user/tasks/claim',
);

export function* operationTaskClaimWorker({
	payload: taskPayload,
}: PayloadAction<ClaimTaskPayload>) {
	try {
		yield call(window.Telegram.WebApp.HapticFeedback.impactOccurred, 'medium');

		const user: CoreUserFieldsFragment = yield select(userSelector);

		const { type, task, userTask } = taskPayload;

		if (task.type === 'link') {
			if (!!userTask?.completed) {
				const opener = window.Telegram.WebApp.openTelegramLink || window.open;
				yield call(opener, task.link ?? '');
				return;
			}

			if (userTask?.status === 'pending') {
				const claimTaskParams: ClaimTaskParams = {
					taskId: task.id,
					isCompleted: true,
					userTaskId: userTask?.id,
					coins: (task.reward_coins || 0) + user.coins,
					userId: user.id,
					status: 'completed',
				};

				const claimTaskResponse: FetchResult<ClaimTaskMutation> = yield call(
					claimTask,
					claimTaskParams,
				);
				if (claimTaskResponse.errors?.length) {
					return;
				}

				const claimedTask =
					claimTaskResponse.data?.updateuser_tasksCollection.records[0];
				const updatedUser =
					claimTaskResponse.data?.updateusersCollection?.records[0];
				if (!claimedTask || !updatedUser) {
					return;
				}
				yield put(userSet(updatedUser));
				yield put(userTaskUpdate(claimedTask));
				return;
			}

			const claimTaskParams: ClaimTaskParams = {
				taskId: task.id,
				isCompleted: false,
				userTaskId: userTask?.id,
				coins: user.coins,
				userId: user.id,
				status: 'pending',
			};
			const claimFirstTaskResponse: FetchResult<ClaimFirstTaskMutation> =
				yield call(claimFirstTask, claimTaskParams);

			if (claimFirstTaskResponse.errors?.length) {
				return;
			}

			const claimedTask =
				claimFirstTaskResponse.data?.insertIntouser_tasksCollection?.records[0];
			const updatedUser =
				claimFirstTaskResponse.data?.updateusersCollection?.records[0];

			if (!claimedTask || !updatedUser) {
				return;
			}
			const opener = window.Telegram.WebApp.openTelegramLink || window.open;
			yield call(opener, task.link ?? '');

			yield put(userSet(updatedUser));
			yield put(userTaskUpdate(claimedTask));
			return;
		}

		const userTaskExists = !!userTask?.id;
		const updatedTaskData = claimTaskHelper(type, task, userTask);
		const newCoins = updatedTaskData?.rewardCoins || 0;
		const claimTaskParams: ClaimTaskParams = {
			taskId: task.id,
			isCompleted: updatedTaskData?.isCompleted ?? false,
			userTaskId: userTask?.id,
			coins: newCoins + user.coins,
			daysCompleted: updatedTaskData?.completedDays ?? 0,
			lastDailyReward:
				updatedTaskData?.lastDailyReward ?? user.last_daily_reward,
			userId: user.id,
		};

		let claimedTask: UserTaskFragment | undefined;
		let updatedUser: CoreUserFieldsFragment | undefined;

		if (userTaskExists) {
			const claimTaskResponse: FetchResult<ClaimTaskMutation> = yield call(
				claimTask,
				claimTaskParams,
			);
			if (claimTaskResponse.errors?.length) {
				return;
			}

			claimedTask =
				claimTaskResponse.data?.updateuser_tasksCollection.records[0];
			updatedUser = claimTaskResponse.data?.updateusersCollection?.records[0];
		} else {
			const claimFirstTaskResponse: FetchResult<ClaimFirstTaskMutation> =
				yield call(claimFirstTask, claimTaskParams);
			if (claimFirstTaskResponse.errors?.length) {
				return;
			}

			claimedTask =
				claimFirstTaskResponse.data?.insertIntouser_tasksCollection?.records[0];
			updatedUser =
				claimFirstTaskResponse.data?.updateusersCollection?.records[0];
		}

		if (!claimedTask || !updatedUser) {
			return;
		}

		yield put(userSet(updatedUser));
		yield put(userTaskUpdate(claimedTask));
	} catch (error) {
		const userData: CoreUserFieldsFragment & WebAppUser =
			yield select(userDataSelector);
		Sentry.captureException(error, {
			contexts: {
				user: {
					...userData,
				},
				meta: {
					message: 'operationClaimTaskWorker',
				},
			},
		});
	}
}
