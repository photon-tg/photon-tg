import { AxiosResponse } from 'axios';
import { ValidatedTelegramUser } from '@/app/api/check-telegram-data/route';
import { call, put, select } from '@redux-saga/core/effects';
import {
	fetchUser,
	FetchUserResponse,
	signIn,
	signUp,
	validateTelegramData,
} from '@/model/user/services';
import {
	userErrorSet,
	userIsConsentGivenSet,
	userIsNewUserSet,
	userReferredIdSet,
	userSet,
	userTelegramUserSet,
	userUsernameSet,
} from '@/model/user/actions';
import { SignUpData, UserCredentials, UserErrorType } from '@/model/user/types';
import { getSignUpData, getUserCredentials } from '@/model/user/utils';
import { AuthResponse, AuthTokenResponsePassword } from '@supabase/auth-js';
import { createAction } from '@reduxjs/toolkit';
import {
	userisConsentGivenSelector,
	userIsNewUserSelector,
} from '@/model/user/selectors';

export const operationAuthenticateUser = createAction(
	'operation:user/authenticate',
);

export function* operationAuthenticateUserWorker() {
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

		if (isNewUser) {
			/** Sign up */
			const signUpData: SignUpData = yield call(
				getSignUpData,
				telegramData.user,
				telegramId,
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
					yield put(userSet(user.data!));
				}

				return;
			}

			return;
		}

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

			console.log(user, 'user', !!user.data?.consent_version || isConsentGiven);
			yield put(userSet(user.data!));
			yield put(
				userIsConsentGivenSet(!!user.data?.consent_version || isConsentGiven),
			);
			yield put(userIsNewUserSet(false));

			return;
		}

		if (signInResponse.error && signInResponse.error.status !== 400)
			throw new Error(UserErrorType.SERVER_ERROR);
	} catch (error) {
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	}
}
