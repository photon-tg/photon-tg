import { call, debounce, put, select, take, takeEvery, takeLeading } from '@redux-saga/core/effects';
import {
	operationUploadPhoto,
	operationAuthenticateUser,
	operationClaimReferrals,
	operationInitDailyReward,
	operationInitUser,
	operationReferrerSet,
	operationRestorePassiveEnergy,
	operationSetUser,
	operationTap,
	operationTapSync,
	operationPayPassiveIncome,
	operationClaimTask, ClaimTaskPayload
} from '@/model/user/operations';
import {
	claimFirstTask,
	claimReferrals, claimTask, ClaimTaskParams,
	getPhotos, getReferral,
	getReferrals, getReferrerData,
	getUser, getUserTasks,
	signIn,
	signUp, synchronizeTaps,
	updateDailyRewardCompletedDays, uploadPhoto, uploadPhotoToBucket,
	validateTelegramData
} from '@/model/user/services';
import { ValidatedTelegramUser } from '@/app/api/check-telegram-data/route';
import { AxiosResponse } from 'axios';
import {
	userCoinsAdd, userEnergyReduce,
	userEnergySet,
	userErrorSet, userIsLoadingSet,
	userLastDailyRewardSet, userLastHourlyRewardSet, userPassiveIncomeRecalculate, userPassiveIncomeSet,
	userPhotosSet,
	userReferralsSet,
	userReferredIdSet,
	userSet,
	userTasksSet,
	userTaskUpdate,
	userTelegramUserSet
} from '@/model/user/actions';
import { claimTaskHelper, getSignUpData, getUserCredentials } from '@/model/user/utils';
import { ReferralData, SignUpData, UserCredentials, UserErrorType } from '@/model/user/types';
import { AuthResponse, AuthTokenResponsePassword } from '@supabase/auth-js';
import {
	AddUserPhotoMutation, ClaimFirstTaskMutation,
	ClaimReferralMutation, ClaimTaskMutation, CoreUserFieldsFragment,
	GetReferralQuery,
	GetUserPhotosQuery,
	GetUserTasksQuery, SynchronizeTapsMutation,
	TaskFragment,
	UpdateDailyRewardCompletedDaysMutation, UserPhotoFragment,
	UserQuery,
	UserTaskFragment
} from '@/gql/graphql';
import { ApolloQueryResult, FetchResult } from '@apollo/client';
import { PayloadAction } from '@reduxjs/toolkit';
import {
	userCoinsSelector,
	userIdSelector, userLastHourlyRewardSelector, userPhotosSelector,
	userReferralsSelector, userReferrerSelector,
	userSelector,
	userTasksSelector,
	userTelegramIdSelector
} from '@/model/user/selectors';
import { parseNodes } from '@/utils/graphql';
import { ReferralsDataResponse } from '@/app/api/referrals-data/route';
import { applicationTasksSelector } from '@/model/application/selectors';
import { calculateEnergyGained, daysSinceDate, getNow, hoursSinceDate } from '@/utils/date';
import {
	getUserLevel,
	Level, levelToCoinsPerTap,
	levelToMaxEnergy,
	levelToPhotoPassiveIncome, levelToPhotoReward,
	PREMIUM_USER_REF_BONUS,
	USER_REF_BONUS
} from '@/constants';
import { referUser, updateUser } from '@/api/api';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';

function* operationSetUserWorker({ payload: userId }: PayloadAction<string>) {
	try {
		const userResponse: ApolloQueryResult<UserQuery> = yield call(getUser, userId);
		const user = userResponse.data.usersCollection?.edges[0].node;

		if (userResponse.error || !user) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}

		yield put(userSet(user));
	} catch (error) {
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	}
}

export function* operationAuthenticateUserWorker() {
	try {
		console.log('here')
		const dataCheckString = window.Telegram.WebApp.initData;
		const { data: telegramData }: AxiosResponse<ValidatedTelegramUser> = yield call(validateTelegramData, dataCheckString);
		console.log('here91')
		if (!telegramData.isValid) {
			console.log('here93')
			yield put(userErrorSet(telegramData.error?.type ?? UserErrorType.SERVER_ERROR));
			return;
		}
		console.log('here97')
		yield put(userTelegramUserSet(telegramData.user));

		if (telegramData.referrerId) {
			yield put(userReferredIdSet(telegramData.referrerId));
		}

		const telegramId: string = yield call(String, telegramData.user.id);
		const credentials: UserCredentials = yield call(getUserCredentials, telegramId);

		const signInResponse: AuthTokenResponsePassword = yield call(signIn, credentials);

		if (!signInResponse.error && signInResponse.data) {
			yield put(operationSetUser(signInResponse.data.user.id));
			return;
		}

		if (signInResponse.error && signInResponse.error.status !== 400) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}

		const signUpData: SignUpData = yield call(getSignUpData, telegramData.user, telegramId);
		const signUpResponse: AuthResponse = yield call(signUp, credentials, signUpData);

		if (!signUpResponse.error && signUpResponse.data.user) {
			yield put(operationSetUser(signUpResponse.data.user.id));
			return;
		}
		console.log('bad');
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	} catch (error) {
		console.log(error, 'MOEW');
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	}
}

export function* operationInitUserWorker() {
	try {
		window.Telegram.WebApp.setHeaderColor('#092646');
		window.Telegram.WebApp.disableVerticalSwipes();

		yield put(operationAuthenticateUser());
		yield take(userSet.type);

		const userId: string = yield select(userIdSelector);
		const userTelegramId: string = yield select(userTelegramIdSelector);

		const photosResponse: ApolloQueryResult<GetUserPhotosQuery> = yield call(getPhotos, userId);
		if (photosResponse.error) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}

		const photos = parseNodes(photosResponse.data.user_photosCollection?.edges ?? []);
		yield put(userPhotosSet(photos));

		const tasksResponse: ApolloQueryResult<GetUserTasksQuery> = yield call(getUserTasks, userId);
		if (tasksResponse.error) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}
		const tasks = parseNodes(tasksResponse.data.user_tasksCollection?.edges ?? []);
		yield put(userTasksSet(tasks));

		const referralsResponse: AxiosResponse<ReferralsDataResponse> = yield call(getReferrals, userTelegramId);

		if (referralsResponse.data.error) {
			yield put(userErrorSet(referralsResponse.data.error.type));
			return;
		}

		const referrals = referralsResponse.data.data;

		yield put(userReferralsSet(referrals));
		yield put(operationInitDailyReward());
		yield put(operationReferrerSet());
		yield put(operationClaimReferrals());
		yield put(operationPayPassiveIncome());
		yield put(operationRestorePassiveEnergy());
		yield put(userPassiveIncomeRecalculate());
		yield put(userIsLoadingSet(false));

		window.Telegram.WebApp.ready();
		!window.Telegram.WebApp.isExpanded && window.Telegram.WebApp.expand();
	} catch (error) {
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
	}
}

export function* operationInitDailyRewardWorker() {
	const tasks: TaskFragment[] = yield select(applicationTasksSelector);
	const user: CoreUserFieldsFragment = yield select(userSelector);
	const userTasks: UserTaskFragment[] = yield select(userTasksSelector);
	const dailyRewardTask: TaskFragment = yield tasks.find((task) => task.id === 'daily_reward');
	const userDailyRewardTask: UserTaskFragment = yield userTasks.find(userTask => userTask.task_id === dailyRewardTask.id)!;

	yield put(userLastDailyRewardSet(user.last_daily_reward ?? null));

	if (!userDailyRewardTask) {
		return;
	}

	const daysSinceLastDailyReward: number = yield user.last_daily_reward ? daysSinceDate(user.last_daily_reward) : 0;

	if (daysSinceLastDailyReward <= 1) {
		return;
	}

	// user started daily quest but skipped day(s)
	const updateUserDailyRewardTaskResponse: FetchResult<UpdateDailyRewardCompletedDaysMutation> = yield call(updateDailyRewardCompletedDays, user.id, userDailyRewardTask.id!, 0);

	if (updateUserDailyRewardTaskResponse.errors?.length) {
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
		return;
	}

	const updatedUserDailyRewardTask = updateUserDailyRewardTaskResponse.data?.updateuser_tasksCollection.records[0];

	if (!updatedUserDailyRewardTask) {
		yield put(userErrorSet(UserErrorType.SERVER_ERROR));
		return;
	}

	yield put(userTaskUpdate(updatedUserDailyRewardTask));
	yield put(userLastDailyRewardSet(null));
}

export function* operationReferrerSetWorker() {
	try {
		const user: CoreUserFieldsFragment = yield select(userSelector);
		const referrerId: string | null = yield select(userReferrerSelector);

		if (!referrerId || user.telegram_id === referrerId) {
			if (user.is_referred === null) {
				yield call(updateUser, { userId: user.id, isReferred: false, user });
			}
			return;
		}

		const referenceData: ApolloQueryResult<GetReferralQuery> = yield call(getReferral, user.telegram_id);
		if (referenceData) {
			return;
		}

		const referrer: AxiosResponse<{ is_premium: boolean }> = yield call(getReferrerData, referrerId);

		if (!referrer.data) {
			return;
		}

		const isReferrerPremium = referrer.data.is_premium ?? false;
		const bonusCoins: number = yield isReferrerPremium ? PREMIUM_USER_REF_BONUS : USER_REF_BONUS;

		yield call(referUser, { referralTgId: user.telegram_id, referrerTgId: referrerId, userId: user.id, coins: user.coins + bonusCoins  });
		yield put(userCoinsAdd(bonusCoins));
	} catch (error) {

	}
}

export function* operationClaimReferralsWorker() {
	try {
		const referrals: ReferralData[] = yield select(userReferralsSelector);
		const telegramId: string = yield select(userTelegramIdSelector);

		const bonusCoins: number = yield referrals?.reduce((totalCoins, referral) => {
			if (referral.is_claimed_by_referrer) {
				return totalCoins;
			}
			const bonusPerReferral = referral.is_premium ? PREMIUM_USER_REF_BONUS : USER_REF_BONUS;
			return totalCoins + bonusPerReferral;
		}, 0);

		if (!bonusCoins) {
			return;
		}

		const claimReferralsResponse: ApolloQueryResult<ClaimReferralMutation> = yield claimReferrals(telegramId);

		if (claimReferralsResponse.error) {
			yield put(userErrorSet(UserErrorType.SERVER_ERROR));
			return;
		}

		const updatedReferrals = referrals.map((referral) => ({
			...referral,
			is_claimed_by_referrer: true,
		}));

		yield put(userReferralsSet(updatedReferrals));
		yield put(userCoinsAdd(bonusCoins));
	} catch (err) {

	}
}

export function* operationPayPassiveIncomeWorker() {
	const photos: UserPhotoFragment[] = yield select(userPhotosSelector);
	const lastHourlyReward: string = yield select(userLastHourlyRewardSelector);

	const photosPassiveIncome: number = yield photos.reduce((total, photo) => {
		/* means that we will calculate passive since the photo creation time */
		const isDoneAfterLastReward = new Date(photo.created_at) > new Date(lastHourlyReward);
		const lastClaimedReward = isDoneAfterLastReward ? photo.created_at : lastHourlyReward;
		const hoursSinceLastReward = hoursSinceDate(lastClaimedReward);
		const photoPassiveIncomePerHour = levelToPhotoPassiveIncome.get(photo.level_at_time as Level) ?? 0;
		const reward = hoursSinceLastReward * photoPassiveIncomePerHour;

		return total + reward;
	}, 0);

	const roundedPhotosPassiveIncome = Math.round(photosPassiveIncome || 0);

	yield put(userCoinsAdd(roundedPhotosPassiveIncome));
}

export function* operationRestorePassiveEnergyWorker() {
	const user: CoreUserFieldsFragment = yield select(userSelector);
	const { newEnergy } = yield calculateEnergyGained(user.last_sync, user.energy);

	const maxEnergy: number = yield levelToMaxEnergy.get(getUserLevel(user.coins));
	const updatedEnergy = newEnergy > maxEnergy ? maxEnergy : newEnergy;
	yield put(userEnergySet(updatedEnergy));
	yield put(userLastHourlyRewardSet(getNow()));
}

function* operationUploadPhotoWorker({ payload: photo }: PayloadAction<string>) {
	const userId: string = yield select(userIdSelector);
	const coins: number = yield select(userCoinsSelector);
	const photos: UserPhotoFragment[] = yield select(userPhotosSelector);
	const photoId: string = yield call(nanoid);
	const photoArrayBuffer = decode(photo.split('base64,')[1]);

	const uploadPhotoToBucketResponse: Awaited<ReturnType<typeof uploadPhotoToBucket>> = yield call(uploadPhotoToBucket, userId, photoId, photoArrayBuffer);

	if (uploadPhotoToBucketResponse.error) {
		return;
	}

	const level = getUserLevel(coins);
	const newCoins = levelToPhotoReward.get(level)! + coins;

	const uploadedPhotoResponse: FetchResult<AddUserPhotoMutation> = yield call(uploadPhoto, userId, photoId, level, newCoins, new Date().toUTCString());
	const uploadedPhoto = uploadedPhotoResponse.data?.insertIntouser_photosCollection?.records[0];

	if (uploadedPhotoResponse.errors?.length || !uploadedPhoto) {
		return;
	}

	const newPhotos = [...photos, uploadedPhoto].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

	yield put(userPhotosSet(newPhotos));
	yield take(userPhotosSet.type);
	yield put(userPassiveIncomeRecalculate());
	yield call(window.push, '/photo/gallery');
}

function* operationTapWorker() {
	try {
		const coins: number = yield select(userCoinsSelector);
		const level: Level = yield call(getUserLevel, coins);
		const coinsPerTap = levelToCoinsPerTap.get(level)!;
		yield put(userCoinsAdd(coinsPerTap));
		yield put(userEnergyReduce(1));
		yield put(operationTapSync());
	} catch (error) {
		console.log(error, 'error')
	}
}

function* operationTapSyncWorker() {
	const user: CoreUserFieldsFragment = yield select(userSelector);

	const synchronizeResponse: FetchResult<SynchronizeTapsMutation> = yield call(synchronizeTaps, user.id, user.coins, user.energy, new Date().toUTCString());

	if (synchronizeResponse.errors?.length) {
		// TODD: log error
	}
}

export function* operationClaimTaskWorker({ payload: taskPayload }: PayloadAction<ClaimTaskPayload>) {
	try {
		yield call(window.Telegram.WebApp.HapticFeedback.impactOccurred, 'medium');

		const user: CoreUserFieldsFragment = yield select(userSelector);

		const { type, task, userTask } = taskPayload;

		const userTaskExists = !!userTask?.id;
		const updatedTaskData = claimTaskHelper(type, task, userTask);
		const newCoins = updatedTaskData?.rewardCoins || 0;
		const claimTaskParams: ClaimTaskParams = {
			taskId: task.id,
			isCompleted: updatedTaskData?.isCompleted ?? false,
			userTaskId: userTask?.id,
			coins: newCoins,
			daysCompleted: updatedTaskData?.completedDays ?? 0,
			lastDailyReward: updatedTaskData?.lastDailyReward ?? user.last_daily_reward,
			userId: user.id,
		};

		let claimedTask: UserTaskFragment | undefined;
		let updatedUser: CoreUserFieldsFragment | undefined;

		if (userTaskExists) {
			const claimTaskResponse: FetchResult<ClaimTaskMutation> = yield call(claimTask, claimTaskParams);
			if (claimTaskResponse.errors?.length) {
				return;
			}

			claimedTask = claimTaskResponse.data?.updateuser_tasksCollection.records[0];
			updatedUser = claimTaskResponse.data?.updateusersCollection?.records[0];
		} else {
			const claimFirstTaskResponse: FetchResult<ClaimFirstTaskMutation> = yield call(claimFirstTask, claimTaskParams);
			if (claimFirstTaskResponse.errors?.length) {
				return;
			}

			claimedTask = claimFirstTaskResponse.data?.insertIntouser_tasksCollection?.records[0];
			updatedUser = claimFirstTaskResponse.data?.updateusersCollection?.records[0];
		}

		if (!claimedTask || !updatedUser) {
			return;
		}

		yield put(userCoinsAdd(newCoins));
		yield put(userSet(updatedUser));
		yield put(userTaskUpdate(claimedTask));
	} catch (error) {
		console.log(error, 'error');
	}
}

function* userWatcher() {
	yield takeLeading(operationInitUser.type, operationInitUserWorker);
	yield takeLeading(operationSetUser.type, operationSetUserWorker);
	yield takeLeading(operationAuthenticateUser.type, operationAuthenticateUserWorker);
	yield takeLeading(operationInitDailyReward.type, operationInitDailyRewardWorker);
	yield takeLeading(operationReferrerSet.type, operationReferrerSetWorker);
	yield takeLeading(operationClaimReferrals.type, operationClaimReferralsWorker);
	yield takeLeading(operationPayPassiveIncome.type, operationPayPassiveIncomeWorker);
	yield takeLeading(operationRestorePassiveEnergy.type, operationRestorePassiveEnergyWorker);
	yield takeLeading(operationUploadPhoto.type, operationUploadPhotoWorker);
	yield takeLeading(operationClaimTask.type, operationClaimTaskWorker);
	yield takeEvery(operationTap.type, operationTapWorker);
	yield debounce(3000, operationTapSync.type, operationTapSyncWorker);
}

export default userWatcher;
