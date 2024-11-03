import { Locales } from '@/constants/locales';

export interface BattleContent {
	title: string;
	description: string;
	id: string;
}

export interface BattleTranslations {
	battles: Record<string, BattleContent>;
}

export interface TranslationsState {
	data: Record<
		Locales,
		{
			battles: BattleTranslations;
		}
	>;
	meta: {
		selectedLocale: Locales;
	};
}
