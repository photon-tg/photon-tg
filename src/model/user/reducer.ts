import { createReducer } from '@reduxjs/toolkit';
import {
	RegisteredUserState,
	UninitializedUserState,
} from '@/model/user/types';
import {
	userCoinsAdd,
	userEnergyAdd,
	userEnergyReduce,
	userEnergySet,
	userErrorSet,
	userIsLoadingSet,
	userLastDailyRewardSet,
	userLastHourlyRewardSet,
	userPassiveIncomeRecalculate,
	userPassiveIncomeSet,
	userPhotosIsUploadingSet,
	userPhotosSet,
	userReferralsSet,
	userReferredIdSet,
	userSet,
	userTasksSet,
	userTaskUpdate,
	userTelegramUserSet,
} from '@/model/user/actions';
import {
	calculatePassiveIncome,
	getIsDailyRewardClaimed,
} from '@/model/user/utils';
import { isToday } from '@/utils/date';

export const getInitialState = ():
	| RegisteredUserState
	| UninitializedUserState => ({
	data: {
		telegramUser: null,
		user: null,
		photos: {
			meta: {
				isUploading: false,
			},
			data: null,
		},
		tasks: null,
		referrals: null,
		isDailyRewardClaimed: false,
		isDailyPhotoCompleted: false,
		passiveIncome: null,
	},
	meta: {
		isLoading: true,
		error: null,
		referrerId: null,
	},
});

const initialState = getInitialState();

const userReducer = createReducer<RegisteredUserState | UninitializedUserState>(
	initialState,
	(builder) =>
		builder
			.addCase(userSet, (draftState, { payload: user }) => {
				draftState.data.user = user;
				draftState.data.isDailyRewardClaimed = getIsDailyRewardClaimed(
					user.last_daily_reward,
				);
				draftState.data.isDailyPhotoCompleted = isToday(user.last_photo);
				draftState.data.passiveIncome = calculatePassiveIncome(
					draftState.data.photos.data,
				);
			})
			.addCase(userErrorSet, (draftState, { payload: error }) => {
				draftState.meta.error = error;
			})
			.addCase(userIsLoadingSet, (draftState, { payload: isLoading }) => {
				draftState.meta.isLoading = isLoading;
			})
			.addCase(userTelegramUserSet, (draftState, { payload: telegramUser }) => {
				draftState.data.telegramUser = telegramUser;
			})
			.addCase(userReferredIdSet, (draftState, { payload: referrerId }) => {
				draftState.meta.referrerId = referrerId;
			})
			.addCase(userPhotosSet, (draftState, { payload: photos }) => {
				draftState.data.photos.data = photos;
			})
			.addCase(userTasksSet, (draftState, { payload: tasks }) => {
				draftState.data.tasks = tasks;
			})
			.addCase(userReferralsSet, (draftState, { payload: referrals }) => {
				draftState.data.referrals = referrals;
			})
			.addCase(userTaskUpdate, (draftState, { payload: task }) => {
				draftState.data.tasks =
					draftState.data.tasks?.map((draftTask) =>
						draftTask.id === task.id ? task : draftTask,
					) ?? null;
			})
			.addCase(
				userLastDailyRewardSet,
				(draftState, { payload: lastDailyReward }) => {
					if (draftState.data.user) {
						draftState.data.user.last_daily_reward = lastDailyReward;
						draftState.data.isDailyRewardClaimed =
							getIsDailyRewardClaimed(lastDailyReward);
					}
				},
			)
			.addCase(
				userLastHourlyRewardSet,
				(draftState, { payload: lastHourlyReward }) => {
					if (draftState.data.user) {
						draftState.data.user.last_hourly_reward = lastHourlyReward;
					}
				},
			)
			.addCase(userCoinsAdd, (draftState, { payload: coins }) => {
				if (draftState.data.user) {
					draftState.data.user.coins = draftState.data.user.coins + coins;
				}
			})
			.addCase(userEnergyAdd, (draftState, { payload: energy }) => {
				if (draftState.data.user) {
					draftState.data.user.energy = draftState.data.user.energy + energy;
				}
			})
			.addCase(userEnergyReduce, (draftState, { payload: energy }) => {
				if (draftState.data.user) {
					draftState.data.user.energy = draftState.data.user.energy - energy;
				}
			})
			.addCase(userEnergySet, (draftState, { payload: energy }) => {
				if (draftState.data.user) {
					draftState.data.user.energy = energy;
				}
			})
			.addCase(
				userPassiveIncomeSet,
				(draftState, { payload: passiveIncome }) => {
					if (draftState.data.user) {
						draftState.data.passiveIncome = passiveIncome;
					}
				},
			)
			.addCase(userPassiveIncomeRecalculate, (draftState) => {
				if (draftState.data.user) {
					draftState.data.passiveIncome = calculatePassiveIncome(
						draftState.data.photos.data,
					);
				}
			})
			.addCase(
				userPhotosIsUploadingSet,
				(draftState, { payload: isUploading }) => {
					if (draftState.data.user) {
						draftState.data.photos.meta.isUploading = isUploading;
					}
				},
			),
);

export default userReducer;
