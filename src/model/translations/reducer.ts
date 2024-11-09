import { TranslationsState } from '@/model/translations/types';
import { createReducer } from '@reduxjs/toolkit';
import {
	selectedLocaleSet,
	setTranslationBattles,
	translationsCommonTranslationsSet,
	translationsIsInitializedSet,
} from '@/model/translations/actions';

export const getInitialState = (): TranslationsState => ({
	data: {
		'en-US': {
			battles: {
				battles: {},
			},
			commonTranslations: {},
		},
		ru: {
			battles: {
				battles: {},
			},
			commonTranslations: {},
		},
	},
	meta: {
		isInitialized: false,
		selectedLocale: 'en-US',
	},
});

const initialState = getInitialState();

const translationsReducer = createReducer<TranslationsState>(
	initialState,
	(builder) =>
		builder
			.addCase(setTranslationBattles, (draftState, { payload: battles }) => {
				const locale = draftState.meta.selectedLocale;
				if (draftState.data[locale].battles.battles) {
					battles.forEach((battle) => {
						draftState.data[locale].battles.battles[battle.id] = battle;
					});
				}
			})
			.addCase(
				translationsCommonTranslationsSet,
				(draftState, { payload: commonTranslations }) => {
					const locale = draftState.meta.selectedLocale;
					// @ts-ignore
					commonTranslations?.map((c) => {
						draftState.data[locale].commonTranslations[c.fields.name] =
							c.fields.value;
					});
				},
			)
			.addCase(selectedLocaleSet, (draftState, { payload: locale }) => {
				draftState.meta.selectedLocale = locale;
			})
			.addCase(
				translationsIsInitializedSet,
				(draftState, { payload: isInitialized }) => {
					draftState.meta.isInitialized = isInitialized;
				},
			),
);

export default translationsReducer;
