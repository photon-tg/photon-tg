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

export function* operationInitApplicationWorker() {
	try {
		const tasksResponse: ApolloQueryResult<TasksQuery> = yield call(getTasks);
		console.log(tasksResponse, 'tasks');
		if (tasksResponse.error) {
			yield put(applicationErrorSet(ApplicationErrorType.NETWORK_ERROR));
			return;
		}

		const tasks = parseNodes(tasksResponse.data.tasksCollection?.edges ?? []);
		yield put(applicationTasksSet(tasks));

		yield put(applicationIsInitializedSet(true));
	} catch (error) {
		yield put(applicationErrorSet(ApplicationErrorType.NETWORK_ERROR));
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
