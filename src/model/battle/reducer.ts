import { createReducer } from '@reduxjs/toolkit';
import { BattleState } from '@/model/battle/types';
import {
	battleBattlesSet,
	battleCanJoinSet,
	battleCurrentBattlePhotosRemove,
	battleCurrentBattlePhotosSet,
	battleCurrentIdSet,
	battleIsAnimatingSet,
	battleIsInitializedSet,
	battleMessageContentSet,
	battleMessageIsShownSet,
	battleSelectedBattleSet,
	battleTimeLeftToJoinSet,
} from '@/model/battle/actions';

export const getInitialState = (): BattleState => ({
	data: {
		battles: [],
		currentBattleId: null,
		currentBattlePhotos: [],
		selectedBattle: null,
		canJoin: false,
		timeLeftToJoin: null,
		message: {
			isShown: true,
			content: {
				title: 'Choose Photo',
				description: `
					<ul style="padding-left: 12px; list-style-type: circle">
						<li>Authors get coins for likes</li>
						<li>You get coins for voting</li>
					</ul>
				`,
			},
		},
	},
	meta: {
		error: null,
		isInitialized: false,
		isAnimating: false,
	},
});

const initialState = getInitialState();

const battleReducer = createReducer<BattleState>(initialState, (builder) =>
	builder
		.addCase(battleBattlesSet, (draftState, { payload: battles }) => {
			draftState.data.battles = battles;
		})
		.addCase(battleCurrentIdSet, (draftState, { payload: currentBattleId }) => {
			draftState.data.currentBattleId = currentBattleId;
		})
		.addCase(
			battleCurrentBattlePhotosSet,
			(draftState, { payload: battlePhotos }) => {
				draftState.data.currentBattlePhotos = battlePhotos;
			},
		)
		.addCase(
			battleIsInitializedSet,
			(draftState, { payload: isInitialized }) => {
				draftState.meta.isInitialized = isInitialized;
			},
		)
		.addCase(battleCurrentBattlePhotosRemove, (draftState) => {
			if (draftState.data.currentBattlePhotos) {
				draftState.data.currentBattlePhotos.shift();
				draftState.data.currentBattlePhotos.shift();
			}
		})
		.addCase(battleIsAnimatingSet, (draftState, { payload: isAnimating }) => {
			draftState.meta.isAnimating = isAnimating;
		})
		.addCase(
			battleSelectedBattleSet,
			(draftState, { payload: selectedBattle }) => {
				draftState.data.selectedBattle = selectedBattle;
			},
		)
		.addCase(battleCanJoinSet, (draftState, { payload: canJoin }) => {
			draftState.data.canJoin = canJoin;
		})
		.addCase(
			battleTimeLeftToJoinSet,
			(draftState, { payload: timeLeftToJoin }) => {
				draftState.data.timeLeftToJoin = timeLeftToJoin;
			},
		)
		.addCase(battleMessageIsShownSet, (draftState, { payload: isShown }) => {
			draftState.data.message.isShown = isShown;
		})
		.addCase(battleMessageContentSet, (draftState, { payload: content }) => {
			draftState.data.message.content = content;
		}),
);

export default battleReducer;