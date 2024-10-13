import { call, put, select, take } from '@redux-saga/core/effects';
import {
	userErrorSet,
	userFriendsSet,
	userIsLoadingSet,
	userPassiveIncomeRecalculate,
	userPhotosSet,
	userSet,
	userTasksSet,
} from '@/model/user/actions';
import { userIdSelector, userSelector } from '@/model/user/selectors';
import {
	CoreUserFieldsFragment,
	UserPhotoFragment,
	UserTaskFragment,
} from '@/gql/graphql';
import {
	fetchFriends,
	fetchPhotos,
	fetchTasks,
	updateUser,
	UpdateUserOptions,
} from '@/model/user/services';
import { UserErrorType } from '@/model/user/types';

import * as Sentry from '@sentry/nextjs';

import { createAction } from '@reduxjs/toolkit';
import { operationAuthenticateUser } from '@/model/user/operations/operationAuthenticateUser';
import { operationInitDailyRewardWorker } from '@/model/user/operations/operationInitDailyReward';
import { operationReferralsClaimWorker } from '@/model/user/operations/operationReferralsClaim';
import { operationPassiveIncomePay } from '@/model/user/operations/operationPassiveIncomePay';
import { operationPassiveEnergyRestoreWorker } from '@/model/user/operations/operationPassiveEnergyRestore';
import { operationReferralInitWorker } from '@/model/user/operations/operationReferralInit';
import { Friend } from '@/app/api/friends/route';

export const operationUserInit = createAction('operation:user/init');

export function* operationUserInitWorker() {
	try {
		window.Telegram.WebApp.setHeaderColor('#092646');
		window.Telegram.WebApp.disableVerticalSwipes();

		yield put(operationAuthenticateUser());
		yield take(userSet.type);

		const userId: string = yield select(userIdSelector);

		const photos: UserPhotoFragment[] = yield call(fetchPhotos, userId);
		yield put(userPhotosSet(photos));

		const userTasks: UserTaskFragment[] = yield call(fetchTasks, userId);
		yield put(userTasksSet(userTasks));

		const friends: Friend[] = yield call(fetchFriends, userId);
		yield put(userFriendsSet(friends));

		yield call(operationInitDailyRewardWorker);
		yield call(operationReferralInitWorker);
		yield call(operationReferralsClaimWorker);
		yield call(operationPassiveIncomePay);
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
		} as UpdateUserOptions);

		yield put(userPassiveIncomeRecalculate());
		yield put(userIsLoadingSet(false));

		window.Telegram.WebApp.ready();
		!window.Telegram.WebApp.isExpanded && window.Telegram.WebApp.expand();
	} catch (error) {
		Sentry.captureException(error, {
			contexts: {},
		});
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	}
}
