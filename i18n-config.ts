export const i18n = {
	defaultLocale: 'en',
	locales: ['en', 'ru'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const i18nLocaleToCmsLocale: Record<Locale, string> = {
	en: 'en-US',
	ru: 'ru'
}

