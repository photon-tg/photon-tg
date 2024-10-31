import { AppState } from '@/store/types';
import { createSelector } from 'reselect';

export const userSelector = (state: AppState) => state.user.data.user;
export const userIdSelector = (state: AppState) => state.user.data.user.id;
export const userCoinsSelector = (state: AppState) =>
	state.user.data.user.coins;
export const userEnergySelector = (state: AppState) =>
	state.user.data.user.energy;
export const userReferrerSelector = (state: AppState) =>
	state.user.meta.referrerId;
export const userTelegramSelector = (state: AppState) =>
	state.user.data.telegramUser;
export const userTelegramIdSelector = (state: AppState) =>
	state.user.data.telegramUser.id;
export const userTasksSelector = (state: AppState) => state.user.data.tasks;
export const userPhotosUploadingSelector = (state: AppState) =>
	state.user.data.photos.meta.isUploading;
export const userPhotosSelector = (state: AppState) =>
	state.user.data.photos.data;
export const userOldPhotosSelector = (state: AppState) =>
	state.user.data.photos.oldData;
export const userLastHourlyRewardSelector = (state: AppState) =>
	state.user.data.user.last_hourly_reward;
export const userIsDailyRewardClaimedSelector = (state: AppState) =>
	state.user.data.isDailyRewardClaimed;
export const userPassiveIncomeSelector = (state: AppState) =>
	state.user.data.passiveIncome;
export const userIsInitializedSelector = (state: AppState) =>
	state.user.meta.isInitialized;
export const userErrorSelector = (state: AppState) => state.user.meta.error;
export const userDailyPhotoIsCompleted = (state: AppState) =>
	state.user.data.isDailyPhotoCompleted;
export const userFriendsSelector = (state: AppState) => state.user.data.friends;
export const userDataSelector = createSelector(
	[userSelector, userReferrerSelector, userTelegramSelector],
	(user, referrerId, telegramUser) => {
		return {
			user,
			telegramUser,
			referrerId,
		};
	},
);
