import { call, put, select, take } from '@redux-saga/core/effects';
import {
	userErrorSet,
	userFriendsSet,
	userIsConsentGivenSet,
	userIsInitializedSet,
	userIsNewUserSet,
	userPassiveIncomeRecalculate,
	userPhotosSet,
	userReferredIdSet,
	userSet,
	userTasksSet,
	userTelegramUserSet,
	userUsernameSet,
} from '@/model/user/actions';
import {
	userIdSelector,
	userisConsentGivenSelector,
	userIsNewUserSelector,
	userSelector,
} from '@/model/user/selectors';
import {
	BattlePhotoFragment,
	CoreUserFieldsFragment,
	UserTaskFragment,
} from '@/gql/graphql';
import {
	fetchFriends,
	fetchPhotos,
	fetchTasks,
	fetchUser,
	FetchUserResponse,
	signIn,
	signUp,
	updateUser,
	UpdateUserOptions,
	validateTelegramData,
} from '@/model/user/services';
import { SignUpData, UserCredentials, UserErrorType } from '@/model/user/types';

import * as Sentry from '@sentry/nextjs';

import { createAction } from '@reduxjs/toolkit';
import { operationAuthenticateUser } from '@/model/user/operations/operationAuthenticateUser';
import { operationInitDailyRewardWorker } from '@/model/user/operations/operationInitDailyReward';
import { operationReferralsClaimWorker } from '@/model/user/operations/operationReferralsClaim';
import { operationPassiveIncomePay } from '@/model/user/operations/operationPassiveIncomePay';
import { operationPassiveEnergyRestoreWorker } from '@/model/user/operations/operationPassiveEnergyRestore';
import { operationReferralInitWorker } from '@/model/user/operations/operationReferralInit';
import { Friend } from '@/app/api/friends/route';
import { operationPhotoLikesCoinsReceive } from '@/model/user/operations/operationPhotoLikesCoinsReceiveWorker';
import { AxiosResponse } from 'axios';
import { ValidatedTelegramUser } from '@/app/api/check-telegram-data/route';
import { getSignUpData, getUserCredentials } from '@/model/user/utils';
import { AuthResponse, AuthTokenResponsePassword } from '@supabase/auth-js';

export const operationUserInit = createAction('operation:user/init');

export function* operationUserInitWorker() {
	try {
		window.Telegram.WebApp.setHeaderColor('#092646');
		window.Telegram.WebApp.disableVerticalSwipes();

		try {
			const dataCheckString = window.Telegram.WebApp.initData;
			const { data: telegramData }: AxiosResponse<ValidatedTelegramUser> =
				yield call(validateTelegramData, dataCheckString);

			const isNewUser: boolean = yield select(userIsNewUserSelector);
			const isConsentGiven: boolean = yield select(userisConsentGivenSelector);

			if (!telegramData.isValid) {
				yield put(
					userErrorSet(telegramData.error?.type ?? UserErrorType.SERVER_ERROR),
				);
				return;
			}

			yield put(userTelegramUserSet(telegramData.user));

			if (telegramData.user.username) {
				yield put(userUsernameSet(telegramData.user.username));
			}

			if (telegramData.referrerId) {
				yield put(userReferredIdSet(telegramData.referrerId));
			}

			const telegramId = String(telegramData.user.id);
			const credentials: UserCredentials = yield call(
				getUserCredentials,
				telegramId,
			);
			console.log(isNewUser, 'isNewUser')
			if (isNewUser) {
				/** Sign up */
				const signUpData: SignUpData = yield call(
					getSignUpData,
					telegramData.user,
					telegramId,
					'1',
				);
				const signUpResponse: AuthResponse = yield call(
					signUp,
					credentials,
					signUpData,
				);

				if (!signUpResponse.error && signUpResponse.data.user) {
					const user: FetchUserResponse = yield call(
						fetchUser,
						signUpResponse.data.user.id,
					);

					if (user.meta?.error) {
						yield put(userErrorSet(user.meta.error));
					} else {
						yield put(userIsConsentGivenSet(true));
						yield put(userSet(user.data!));
					}
				}
			}

			if (!isNewUser) {
				/** Sign in */
				const signInResponse: AuthTokenResponsePassword = yield call(
					signIn,
					credentials,
				);

				if (!signInResponse.error && signInResponse.data) {
					const user: FetchUserResponse = yield call(
						fetchUser,
						signInResponse.data.user.id,
					);

					if (user.meta?.error) {
						yield put(userErrorSet(user.meta.error));
						return;
					}

					yield put(userSet(user.data!));
					yield put(
						userIsConsentGivenSet(
							!!user.data?.consent_version || isConsentGiven,
						),
					);
					yield put(userIsNewUserSet(false));
				}

				if (signInResponse.error && signInResponse.error.status === 400) {
					console.log('set stuff')
					yield put(userIsNewUserSet(true));
					yield put(userIsConsentGivenSet(false));
				}

				if (signInResponse.error && signInResponse.error.status !== 400)
					throw new Error(UserErrorType.SERVER_ERROR);
			}
		} catch (error) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
		}

		const isConsentGiven: boolean = yield select(userisConsentGivenSelector);

		if (!isConsentGiven) {
			yield put(userIsInitializedSet(true));
			return;
		}

		const userId: string = yield select(userIdSelector);

		const photos: BattlePhotoFragment[] = yield call(fetchPhotos, userId);
		yield put(userPhotosSet(photos));

		const userTasks: UserTaskFragment[] = yield call(fetchTasks, userId);
		yield put(userTasksSet(userTasks));

		const friends: Friend[] = yield call(fetchFriends, userId);
		yield put(userFriendsSet(friends));

		yield call(operationInitDailyRewardWorker);
		yield call(operationReferralInitWorker);
		yield call(operationReferralsClaimWorker);
		yield call(operationPassiveIncomePay);
		yield put(operationPhotoLikesCoinsReceive());
		yield call(operationPassiveEnergyRestoreWorker);

		const user: CoreUserFieldsFragment = yield select(userSelector);

		yield call(updateUser, {
			userId,
			user,
			isReferred: user.is_referred,
			lastHourlyReward: user.last_hourly_reward,
			lastDailyReward: user.last_daily_reward,
			energy: user.energy,
			coins: user.coins,
			lastLikesClaim: user.last_likes_claim,
			username: user.username,
			consentVersion: '1',
		} as UpdateUserOptions);

		yield put(userPassiveIncomeRecalculate());
		yield put(userIsInitializedSet(true));

		window.Telegram.WebApp.ready();
		!window.Telegram.WebApp.isExpanded && window.Telegram.WebApp.expand();
	} catch (error) {
		Sentry.captureException(error, {
			contexts: {},
		});
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	}
}
