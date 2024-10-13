import { CoreUserFieldsFragment, SynchronizeTapsMutation } from '@/gql/graphql';
import { call, select } from '@redux-saga/core/effects';
import { userSelector } from '@/model/user/selectors';
import { FetchResult } from '@apollo/client';
import { synchronizeTaps } from '@/model/user/services';
import * as Sentry from '@sentry/nextjs';
import { createAction } from '@reduxjs/toolkit';

export const operationTapSync = createAction('operation:user/taps/sync');

export function* operationTapSyncWorker() {
	const user: CoreUserFieldsFragment = yield select(userSelector);

	const synchronizeResponse: FetchResult<SynchronizeTapsMutation> = yield call(
		synchronizeTaps,
		user.id,
		user.coins,
		user.energy,
		new Date().toUTCString(),
	);

	if (synchronizeResponse.errors?.length) {
		Sentry.captureException(synchronizeResponse.errors, {
			contexts: {
				user: {
					...user,
				},
				meta: {
					message: 'operationTapSyncWorker',
				},
			},
		});
	}
}
