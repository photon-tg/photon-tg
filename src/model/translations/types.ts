export interface BattleContent {
	title: string;
	description: string;
	id: string;
}

export interface BattleTranslations {
	battles: Record<string, BattleContent>;
}

export interface TranslationsState {
	data: {
		battles: BattleTranslations;
	};
	meta: {};
}
