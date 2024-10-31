import { AppState } from '@/store/types';
import { createSelector } from 'reselect';
import { battleCurrentBattleIdSelector } from '@/model/battle/selectors';

export const translationsBattlesSelector = (state: AppState) =>
	state.translations.data.battles.battles;
export const translationsCurrentBattleSelect = createSelector(
	[battleCurrentBattleIdSelector, translationsBattlesSelector],
	(battleId, battles) => battles && battleId && battles[battleId],
);
