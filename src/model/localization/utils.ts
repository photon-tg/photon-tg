import ru from './translations/compiled/ru.json';
import en from './translations/compiled/en.json';
import { Locale } from '../../../i18n-config';

export interface Translations {
	[key: string]: string;
}

export const translationsMap: { [locale in Locale]: Translations } = {
	ru: ru,
	en: en,
};

export const getTranslations = (locale: Locale): Translations =>
	translationsMap[locale] ?? {};
