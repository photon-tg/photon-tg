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
	userFriendsSet,
	userIsInitializedSet,
	userIsReferredSet,
	userLastDailyRewardSet,
	userLastHourlyRewardSet, userLastLikesClaimSet,
	userPassiveIncomeRecalculate,
	userPassiveIncomeSet,
	userPhotosIsUploadingSet,
	userPhotosSet,
	userReferredIdSet,
	userSet,
	userTasksSet,
	userTaskUpdate,
	userTelegramUserSet
} from '@/model/user/actions';
import {
	calculatePassiveIncome,
	getIsDailyRewardClaimed,
} from '@/model/user/utils';
import { isToday } from '@/utils/date';
import { getUserLevel, levelToMaxEnergy } from '@/constants';

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
		friends: null,
		isDailyRewardClaimed: false,
		isDailyPhotoCompleted: false,
		passiveIncome: null,
	},
	meta: {
		isInitialized: false,
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
			.addCase(
				userIsInitializedSet,
				(draftState, { payload: isInitialized }) => {
					draftState.meta.isInitialized = isInitialized;
				},
			)
			.addCase(userTelegramUserSet, (draftState, { payload: telegramUser }) => {
				draftState.data.telegramUser = telegramUser;
			})
			.addCase(userReferredIdSet, (draftState, { payload: referrerId }) => {
				draftState.meta.referrerId = referrerId;
			})
			.addCase(userPhotosSet, (draftState, { payload: photos }) => {
				console.log(photos, 'sf');
				draftState.data.photos.data = photos;
				draftState.data.passiveIncome = calculatePassiveIncome(
					draftState.data.photos.data,
				);
			})
			.addCase(userTasksSet, (draftState, { payload: tasks }) => {
				draftState.data.tasks = tasks;
			})
			.addCase(userTaskUpdate, (draftState, { payload: task }) => {
				const taskExists = draftState.data.tasks?.find((t) => t.id === task.id);

				if (taskExists) {
					draftState.data.tasks =
						draftState.data.tasks?.map((draftTask) =>
							draftTask.id === task.id ? task : draftTask,
						) ?? null;
				}

				if (!taskExists) {
					const prevTasks = draftState.data.tasks ?? [];
					draftState.data.tasks = [...prevTasks, task];
				}
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
					const maxEnergy = levelToMaxEnergy.get(
						getUserLevel(draftState.data.user.coins),
					)!;
					const nextEnergy = draftState.data.user.energy + energy;
					draftState.data.user.energy =
						nextEnergy > maxEnergy ? maxEnergy : nextEnergy;
				}
			})
			.addCase(userEnergyReduce, (draftState, { payload: energy }) => {
				if (draftState.data.user) {
					const newEnergy = draftState.data.user.energy - energy;
					draftState.data.user.energy = newEnergy < 0 ? 0 : newEnergy;
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
			.addCase(userIsReferredSet, (draftState, { payload: isReferred }) => {
				if (draftState.data.user) {
					draftState.data.user.is_referred = isReferred;
				}
			})
			.addCase(
				userPhotosIsUploadingSet,
				(draftState, { payload: isUploading }) => {
					if (draftState.data.user) {
						draftState.data.photos.meta.isUploading = isUploading;
					}
				},
			)
			.addCase(userFriendsSet, (draftState, { payload: friends }) => {
				draftState.data.friends = friends;
			})
			.addCase(userLastLikesClaimSet, (draftState, { payload: lastLikesClaim }) => {
				if (draftState.data.user) {
					draftState.data.user.last_likes_claim = lastLikesClaim;
				}
			}),
);

export default userReducer;
