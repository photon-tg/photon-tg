import { call, put, select } from '@redux-saga/core/effects';
import { userCoinsSelector, userDataSelector } from '@/model/user/selectors';
import { getUserLevel, Level, levelToCoinsPerTap } from '@/constants';
import { userCoinsAdd, userEnergyReduce } from '@/model/user/actions';
import { operationTapSync } from '@/model/user/operations/operationTapSyncWorker';
import { CoreUserFieldsFragment } from '@/gql/graphql';
import * as Sentry from '@sentry/nextjs';
import { createAction } from '@reduxjs/toolkit';

export const operationTap = createAction('operation:user/taps/tap');

export function* operationTapWorker() {
	try {
		const coins: number = yield select(userCoinsSelector);
		const level: Level = yield call(getUserLevel, coins);
		const coinsPerTap = levelToCoinsPerTap.get(level)!;
		yield put(userCoinsAdd(coinsPerTap));
		yield put(userEnergyReduce(1));
		yield put(operationTapSync());
	} catch (error) {
		const userData: CoreUserFieldsFragment & WebAppUser =
			yield select(userDataSelector);
		Sentry.captureException(error, {
			contexts: {
				user: {
					...userData,
				},
				meta: {
					message: 'operationTapWorker',
				},
			},
		});
	}
}
