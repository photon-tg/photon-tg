import { AppState } from '@/store/types';
import { createSelector } from 'reselect';

export const battlePhotosSelector = (state: AppState) =>
	state.battle.data.currentBattlePhotos;
export const battleIsAnimatingSelector = (state: AppState) =>
	state.battle.meta.isAnimating;

export const battleIsInitializedSelector = (state: AppState) =>
	state.battle.meta.isInitialized;

export const battleBattlesSelector = (state: AppState) =>
	state.battle.data.battles;
export const battleSelectedBattleSelector = (state: AppState) =>
	state.battle.data.selectedBattle;
export const battleCurrentBattleIdSelector = (state: AppState) =>
	state.battle.data.currentBattleId;
export const battleSelectedBattleDataSelector = createSelector(
	[battleSelectedBattleSelector, battleBattlesSelector],
	(selectedBattle, battles) =>
		battles.find(({ id }) => id === selectedBattle?.id),
);

export const battleSelectedBattleUserPhoto = (state: AppState) =>
	state.battle.data.selectedBattle?.userPhoto;
export const battleCanJoinSelector = (state: AppState) =>
	state.battle.data.canJoin;
export const battleTimeLeftToJoinSelector = (state: AppState) =>
	state.battle.data.timeLeftToJoin;
export const battleTimeLeftToVoteSelector = (state: AppState) =>
	state.battle.data.timeLeftToVote;

export const battleMessageSelector = (state: AppState) =>
	state.battle.data.message;

export const battleHasJoinedSelector = (state: AppState) =>
	state.battle.data.hasJoined;

export const activeJoinBattleIdSelector = (state: AppState) =>
	state.battle.data.activeJoinBattleId;
export const activeVoteBattleIdSelector = (state: AppState) =>
	state.battle.data.activeVoteBattleId;

export const activeJoinBattleSelector = createSelector(
	[activeJoinBattleIdSelector, battleBattlesSelector],
	(activeBattleId, battles) => battles.find(({ id }) => id === activeBattleId),
);

export const activeVoteBattleSelector = createSelector(
	[activeVoteBattleIdSelector, battleBattlesSelector],
	(activeBattleId, battles) => battles.find(({ id }) => id === activeBattleId),
);
