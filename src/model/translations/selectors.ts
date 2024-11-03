import { AppState } from '@/store/types';
import { createSelector } from 'reselect';
import {
	battleCurrentBattleIdSelector,
	battleSelectedBattleSelector,
} from '@/model/battle/selectors';

export const selectedLocaleSelector = (state: AppState) =>
	state.translations.meta.selectedLocale;

export const translationsDataSelector = (state: AppState) =>
	state.translations.data;
export const translationsIsInitializedSelector = (state: AppState) =>
	state.translations.meta.isInitialized;

export const translationsBattlesSelector = createSelector(
	[selectedLocaleSelector, translationsDataSelector],
	(locale, data) => data?.[locale]?.battles?.battles,
);

export const translationsCurrentBattleSelect = createSelector(
	[battleCurrentBattleIdSelector, translationsBattlesSelector],
	(battleId, battles) => battles && battleId && battles[battleId],
);

export const translationsSelectedBattleSelect = createSelector(
	[battleSelectedBattleSelector, translationsBattlesSelector],
	(selectedBattle, battles) =>
		battles && selectedBattle && battles[selectedBattle.id],
);

export const translationsCommonTranslationsSelect = createSelector(
	[selectedLocaleSelector, translationsDataSelector],
	(locale, data) => data?.[locale]?.commonTranslations,
);
