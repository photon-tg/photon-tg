import { createAction } from '@reduxjs/toolkit';
import { TaskType } from '@/types/Task';
import { TaskFragment, UserTaskFragment } from '@/gql/graphql';

export const operationInitUser = createAction('operation:user/init');
export const operationInitDailyReward = createAction('operation:user/dailyRewards/init');
export const operationReferrerSet = createAction('operation:user/referrer/set');
export const operationSetUser = createAction<string>('operation:user/set');
export const operationAuthenticateUser = createAction('operation:user/authenticate');
export const operationClaimReferrals = createAction('operation:user/referrals/claim');
export const operationClaimTask = createAction<ClaimTaskPayload>('operation:user/tasks/claim');
export const operationPayPassiveIncome = createAction('operation:user/passiveIncome/pay');
export const operationRestorePassiveEnergy = createAction('operation:user/energy/restore');
export const operationUploadPhoto = createAction<string>('operation:user/photos/upload');
export const operationTap = createAction('operation:user/taps/tap');
export const operationTapSync = createAction('operation:user/taps/sync');

export interface ClaimTaskPayload {
	type: TaskType,
	task: TaskFragment;
	userTask?: UserTaskFragment;
}
