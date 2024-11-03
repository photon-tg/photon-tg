import { createAction } from '@reduxjs/toolkit';
import { UserErrorType } from '@/model/user/types';
import {
	BattlePhotoFragment,
	CoreUserFieldsFragment,
	UserTaskFragment,
} from '@/gql/graphql';
import { Friend } from '@/app/api/friends/route';

export const userSet = createAction<CoreUserFieldsFragment>('user/set');
export const userTelegramUserSet = createAction<WebAppUser>(
	'user/telegramUser/set',
);
export const userReferredIdSet = createAction<string>('user/referrerId/set');
export const userErrorSet = createAction<UserErrorType>('user/error/set');
export const userIsInitializedSet = createAction<boolean>(
	'user/isInitialized/set',
);
export const userPhotosSet =
	createAction<BattlePhotoFragment[]>('user/photos/set');
export const userPhotosIsUploadingSet = createAction<boolean>(
	'user/photos/isUploading/set',
);
export const userTasksSet = createAction<UserTaskFragment[]>('user/tasks/set');
export const userLastDailyRewardSet = createAction<string | null>(
	'user/lastDailyReward/set',
);
export const userLastHourlyRewardSet = createAction<string>(
	'user/lastHourlyReward/set',
);
export const userCoinsAdd = createAction<number>('user/coins/add');
export const userEnergyAdd = createAction<number>('user/energy/add');
export const userEnergyReduce = createAction<number>('user/energy/reduce');
export const userEnergySet = createAction<number>('user/energy/set');
export const userTaskUpdate =
	createAction<UserTaskFragment>('user/task/update');
export const userPassiveIncomeSet = createAction<number>(
	'user/passiveIncome/set',
);
export const userPassiveIncomeRecalculate = createAction(
	'user/passiveIncome/recalculate',
);
export const userIsReferredSet = createAction<boolean>('user/isReferred/set');
export const userFriendsSet = createAction<Friend[]>('user/friends/set');
export const userUsernameSet = createAction<string>('user/username/set');
export const userLastLikesClaimSet = createAction<string>(
	'user/lastLikesClaim/set',
);
