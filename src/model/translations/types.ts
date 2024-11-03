import { Locales } from '@/constants/locales';

export interface BattleContent {
	title: string;
	description: string;
	id: string;
}

export interface CommonTranslation {
	name: string;
	value: string;
}

export interface BattleTranslations {
	battles: Record<string, BattleContent>;
}

export interface TranslationsState {
	data: Record<
		Locales,
		{
			battles: BattleTranslations;
			commonTranslations: Record<string, string>;
		}
	>;
	meta: {
		isInitialized: boolean;
		selectedLocale: Locales;
	};
}
