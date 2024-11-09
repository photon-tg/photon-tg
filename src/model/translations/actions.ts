import { createAction } from '@reduxjs/toolkit';
import { BattleContent } from '@/model/translations/types';
import { Locales } from '@/constants/locales';

export const setTranslationBattles = createAction<BattleContent[]>(
	'translations/battles/set',
);
// @ts-ignore
export const translationsCommonTranslationsSet = createAction<any>(
	'translations/commonTranslations/set',
);

export const selectedLocaleSet = createAction<Locales>(
	'translations/selectedLocale/set',
);

export const translationsIsInitializedSet = createAction<boolean>(
	'translations/isInitialized/set',
);
