import { TranslationsState } from '@/model/translations/types';
import { createReducer } from '@reduxjs/toolkit';
import {
	selectedLocaleSet,
	setTranslationBattles,
} from '@/model/translations/actions';

export const getInitialState = (): TranslationsState => ({
	data: {
		'en-US': {
			battles: {
				battles: {},
			},
		},
		ru: {
			battles: {
				battles: {},
			},
		},
	},
	meta: {
		selectedLocale: 'en-US',
	},
});

const initialState = getInitialState();

const translationsReducer = createReducer<TranslationsState>(
	initialState,
	(builder) =>
		builder
			.addCase(setTranslationBattles, (draftState, { payload: battle }) => {
				const locale = draftState.meta.selectedLocale;
				if (draftState.data[locale].battles.battles) {
					draftState.data[locale].battles.battles[battle.id] = battle;
				}
			})
			.addCase(selectedLocaleSet, (draftState, { payload: locale }) => {
				draftState.meta.selectedLocale = locale;
			}),
);

export default translationsReducer;
