import { createAction } from '@reduxjs/toolkit';
import { BattleFragment, BattlePhotoFragment } from '@/gql/graphql';
import { SelectedBattle, Top } from '@/model/battle/types';

export const battleBattlesSet =
	createAction<BattleFragment[]>('battle/battles/set');
export const battleCurrentBattlePhotosSet =
	createAction<BattlePhotoFragment[]>('battle/photos/set');
export const battleCurrentIdSet = createAction<string>(
	'battle/currentBattleId/set',
);
export const battleActivePhotosSet = createAction<
	[BattlePhotoFragment, BattlePhotoFragment]
>('battle/activePhotos/set');
export const battleCurrentBattlePhotosRemove = createAction(
	'battle/photos/remove',
);

export const battleIsAnimatingSet = createAction<boolean>(
	'battle/isAnimating/set',
);

export const battleIsInitializedSet = createAction<boolean>(
	'battle/isInitialized/set',
);

export const battleUserBattlesPhotosSet = createAction<BattlePhotoFragment[]>(
	'battle/userPhotos/set',
);
export const battleSelectedBattleSet = createAction<SelectedBattle>(
	'battle/selectedBattle/set',
);
export const battleTopSet = createAction<{ battleId: string; top: Top[] }>(
	'battle/top/set',
);

export const battleCanJoinSet = createAction<boolean>('battle/canJoin/set');

export const battleTimeLeftToJoinSet = createAction<number | null>(
	'battle/timeLeftToJoin/set',
);
export const battleTimeLeftToVoteSet = createAction<{
	formattedHours: string;
	formattedMinutes: string;
}>('battle/timeLeftToVote/set');
export const battleMessageIsShownSet = createAction<boolean>(
	'battle/message/isShown/set',
);
export const battleMessageContentSet = createAction<{
	title: string;
	description: string;
}>('battle/message/content/set');
export const battleHasJoinedSet = createAction<boolean>('battle/hasJoined/set');

export const activeJoinBattleIdSet = createAction<string>(
	'battle/activeJoinBattleId/set',
);
export const activeVoteBattleIdSet = createAction<string>(
	'battle/activeVoteBattleId/set',
);
