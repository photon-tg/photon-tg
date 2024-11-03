import { createAction } from '@reduxjs/toolkit';
import { BattleContent } from '@/model/translations/types';
import { Locales } from '@/constants/locales';

export const setTranslationBattles = createAction<BattleContent>(
	'translations/battles/set',
);

export const selectedLocaleSet = createAction<Locales>(
	'translations/selectedLocale/set',
);
