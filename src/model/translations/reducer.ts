import { TranslationsState } from '@/model/translations/types';
import { createReducer } from '@reduxjs/toolkit';
import { setTranslationBattles } from '@/model/translations/actions';

export const getInitialState = (): TranslationsState => ({
	data: {
		battles: {
			battles: {},
		},
	},
	meta: {},
});

const initialState = getInitialState();

const translationsReducer = createReducer<TranslationsState>(
	initialState,
	(builder) =>
		builder.addCase(
			setTranslationBattles,
			(draftState, { payload: battle }) => {
				console.log(battle, 'b');
				draftState.data.battles.battles[battle.id] = battle;
			},
		),
);

export default translationsReducer;
