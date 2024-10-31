import { createAction } from '@reduxjs/toolkit';
import { BattleContent } from '@/model/translations/types';

export const setTranslationBattles = createAction<BattleContent>(
	'translations/battles/set',
);
