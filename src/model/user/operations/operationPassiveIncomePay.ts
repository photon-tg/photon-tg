import { CoreUserFieldsFragment, UserPhotoFragment } from '@/gql/graphql';
import { call, put, select } from '@redux-saga/core/effects';
import {
	userDataSelector,
	userLastHourlyRewardSelector,
	userPhotosSelector,
} from '@/model/user/selectors';
import { getPassiveIncome } from '@/model/user/utils';
import { userCoinsAdd, userLastHourlyRewardSet } from '@/model/user/actions';
import * as Sentry from '@sentry/nextjs';
import { createAction } from '@reduxjs/toolkit';

export const operationPassiveIncomePay = createAction(
	'operation:user/passiveIncome/pay',
);

export function* operationPassiveIncomePayWorker() {
	const photos: UserPhotoFragment[] = yield select(userPhotosSelector);
	const lastHourlyReward: string = yield select(userLastHourlyRewardSelector);

	try {
		const passiveIncome: number = yield call(
			getPassiveIncome,
			photos,
			lastHourlyReward,
		);

		if (passiveIncome) {
			yield put(userCoinsAdd(passiveIncome));
			yield put(userLastHourlyRewardSet(new Date().toISOString()));
		}
	} catch (error) {
		const userData: CoreUserFieldsFragment & WebAppUser =
			yield select(userDataSelector);
		Sentry.captureException(error, {
			contexts: {
				user: {
					...userData,
					photos,
					lastHourlyReward,
				},
				meta: {
					message: 'operationPayPassiveIncomeWorker',
				},
			},
		});
	}
}
