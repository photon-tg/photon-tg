import { UserErrorType } from '@/model/user/types';
import { call, put, select } from '@redux-saga/core/effects';
import { userDataSelector, userIdSelector } from '@/model/user/selectors';
import { PREMIUM_USER_REF_BONUS, USER_REF_BONUS } from '@/constants';
import { ApolloQueryResult } from '@apollo/client';
import {
	ClaimReferralMutation,
	CoreUserFieldsFragment,
	GetReferralsQuery,
} from '@/gql/graphql';
import {
	claimUserReferralsBonus,
	getUserReferrals,
} from '@/model/user/services';
import { userCoinsAdd, userErrorSet } from '@/model/user/actions';
import * as Sentry from '@sentry/nextjs';
import { createAction } from '@reduxjs/toolkit';

export const operationReferralsClaim = createAction(
	'operation:user/referrals/claim',
);

export function* operationReferralsClaimWorker() {
	const userId: string = yield select(userIdSelector);

	try {
		const referralsResponse: ApolloQueryResult<GetReferralsQuery> = yield call(
			getUserReferrals,
			userId,
		);

		const referrals = referralsResponse.data.user_referencesCollection?.edges;
		if (
			referralsResponse.error ||
			referralsResponse.errors?.length ||
			!referrals?.length
		) {
			return;
		}

		const referencesBonus = referrals.reduce((total, referral) => {
			if (referral.node.bonus_claimed) return total;
			const referralBonus = referral.node.is_referred_premium
				? PREMIUM_USER_REF_BONUS
				: USER_REF_BONUS;

			return total + referralBonus;
		}, 0);

		if (!referencesBonus) return;

		const claimReferralsResponse: ApolloQueryResult<ClaimReferralMutation> =
			yield call(claimUserReferralsBonus, userId);

		if (claimReferralsResponse.error || claimReferralsResponse.errors?.length) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}

		yield put(userCoinsAdd(referencesBonus));
	} catch (error) {
		const userData: CoreUserFieldsFragment & WebAppUser =
			yield select(userDataSelector);
		Sentry.captureException(error, {
			contexts: {
				user: {
					...userData,
				},
				meta: {
					message: 'operationClaimReferralsWorker',
				},
			},
		});
	}
}
