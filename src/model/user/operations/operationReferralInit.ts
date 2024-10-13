import { call, put, select } from '@redux-saga/core/effects';
import { userReferrerSelector, userSelector } from '@/model/user/selectors';
import { CoreUserFieldsFragment } from '@/gql/graphql';
import { userCoinsAdd, userIsReferredSet } from '@/model/user/actions';
import { referUser } from '@/model/user/services';
import { ReferUserResponse } from '@/app/api/refer/route';
import { PREMIUM_USER_REF_BONUS, USER_REF_BONUS } from '@/constants';
import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

export const operationReferralInit = createAction(
	'operation:user/referral/init',
);

export function* operationReferralInitWorker() {
	const user: CoreUserFieldsFragment = yield select(userSelector);
	const referrer: string | null = yield select(userReferrerSelector);

	const isInitialized = typeof user.is_referred === 'boolean';
	if (isInitialized) return;

	const isReferred = referrer && referrer !== user.telegram_id;

	if (!isReferred) {
		yield put(userIsReferredSet(false));
		return;
	}

	try {
		const referUserResponse: AxiosResponse<ReferUserResponse> = yield call(
			referUser,
			{
				userId: user.id,
				isPremium: user.is_premium ?? false,
				referrer,
			},
		);

		if (referUserResponse.data.meta.error) return;

		if (referUserResponse.data.data?.isReferrerUser) {
			const bonusCoins = user.is_premium
				? PREMIUM_USER_REF_BONUS
				: USER_REF_BONUS;
			yield put(userCoinsAdd(bonusCoins));
		}

		yield put(userIsReferredSet(true));
	} catch (error) {
		console.error(error);
	}
}
