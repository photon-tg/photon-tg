import { AppState } from '@/store/types';
import { createSelector } from 'reselect';

export const battleIdSelector = (state: AppState) =>
	state.battle.data.currentBattleId;
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
export const battleCurrentBattleSelector = createSelector(
	[battleCurrentBattleIdSelector, battleBattlesSelector],
	(currentBattleId, battles) =>
		battles.find(({ id }) => id === currentBattleId),
);
export const battleSelectedBattleUserPhoto = (state: AppState) =>
	state.battle.data.selectedBattle?.userPhoto;
export const battleCanJoinSelector = (state: AppState) =>
	state.battle.data.canJoin;
export const battleTimeLeftToJoinSelector = (state: AppState) =>
	state.battle.data.timeLeftToJoin;

export const battleMessageSelector = (state: AppState) =>
	state.battle.data.message;

export const battleHasJoinedSelector = (state: AppState) =>
	state.battle.data.hasJoined;
