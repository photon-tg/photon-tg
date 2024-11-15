import { Locale } from '../../i18n-config';

export type Locales = 'en-US' | 'ru';

export enum CMSLocale {
	'en' = 'English',
	'ru' = 'Русский',
}

const localeNames = ['English', 'Russian'];

export const localeToName: Record<Locale, string> = {
	en: 'English',
	ru: 'Русский',
};
