import { Montserrat } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Locale } from '../../i18n-config';
import Script from 'next/script';
import './globals.css';
import 'symbol-observable';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Photon',
	description: 'Photon',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { lang: Locale };
}>) {
	return (
		<html className={inter.className} lang={params.lang}>
			<body
				className={
					'h-full bg-gradient-to-b from-[#0A2647] from-0% to-[#062243] to-100% bg-no-repeat'
				}
			>
				{children}
				<Script
					src="https://telegram.org/js/telegram-web-app.js"
					strategy={'beforeInteractive'}
				/>
			</body>
		</html>
	);
}
