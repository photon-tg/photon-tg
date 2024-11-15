import { ApplicationProviders } from '@/components/ApplicationProviders';
import { i18n, Locale } from '../../../i18n-config';
import { notFound } from 'next/navigation';

import { defineQuery } from 'next-sanity';
import { client } from '../../../sanity/lib/client';

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

const BATTLES_QUERY = defineQuery(`*[
  _type == "battle"
]{
    name,
    description,
    id
}`);

export default async function LangLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ lang: Locale }>;
}>) {
	const { lang } = await params;
	const battlesContent = await client.fetch(BATTLES_QUERY, {});

	if (!i18n.locales.includes(lang)) {
		notFound();
	}

	return (
		<ApplicationProviders battlesContent={battlesContent} lang={lang}>
			{children}
		</ApplicationProviders>
	);
}
