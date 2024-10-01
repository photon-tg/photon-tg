import { call, put, takeLeading } from '@redux-saga/core/effects';
import { operationInitApplication } from '@/model/application/operations';
import { TasksQuery } from '@/gql/graphql';
import { getTasks } from '@/model/application/services';
import { ApolloQueryResult } from '@apollo/client';
import {
	applicationErrorSet,
	applicationIsInitializedSet,
	applicationTasksSet,
} from '@/model/application/actions';
import { ApplicationErrorType } from '@/model/application/types';
import { parseNodes } from '@/utils/graphql';
import * as Sentry from '@sentry/nextjs';

export function* operationInitApplicationWorker() {
	try {
		const tasksResponse: ApolloQueryResult<TasksQuery> = yield call(getTasks);
		if (tasksResponse.error) {
			yield put(applicationErrorSet(ApplicationErrorType.NETWORK_ERROR));
			return;
		}

		const tasks = parseNodes(tasksResponse.data.tasksCollection?.edges ?? []);
		// if (tasks.length === 0) {
			Sentry.captureException(tasks, {
				level: 'error',
				contexts: {
					app: {
						place: 'zero tasks',
					}
				},
			});
		// }
		yield put(applicationTasksSet(tasks));
	} catch (error) {
		Sentry.captureException(error, {
			level: 'error',
			contexts: {
				app: {
					place: 'operationInitApplication',
				}
			},
		});
		yield put(applicationErrorSet(ApplicationErrorType.NETWORK_ERROR));
	} finally {
		yield put(applicationIsInitializedSet(true));
	}
}

function* applicationWatcher() {
	yield takeLeading(
		operationInitApplication.type,
		operationInitApplicationWorker,
	);
}

export default applicationWatcher;
