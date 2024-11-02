import { AppState } from '@/store/types';
import { createSelector } from 'reselect';
import {
	battleCurrentBattleIdSelector,
	battleSelectedBattleSelector,
} from '@/model/battle/selectors';

export const translationsBattlesSelector = (state: AppState) =>
	state.translations.data.battles.battles;
export const translationsCurrentBattleSelect = createSelector(
	[battleCurrentBattleIdSelector, translationsBattlesSelector],
	(battleId, battles) => battles && battleId && battles[battleId],
);

export const translationsSelectedBattleSelect = createSelector(
	[battleSelectedBattleSelector, translationsBattlesSelector],
	(selectedBattle, battles) =>
		battles && selectedBattle && battles[selectedBattle.id],
);
