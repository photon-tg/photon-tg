import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import 'symbol-observable';
import Script from 'next/script';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

import { ApplicationProviders } from '@/components/ApplicationProviders';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Photon',
	description: 'Phton',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={inter.className} lang={'en'}>
		<GoogleTagManager gtmId="GTM-59KV2HBP" />
		<GoogleAnalytics gaId={'G-SQ0XS74EJ2'} />
			<body
				className={
					'h-full bg-gradient-to-b from-[#0A2647] from-0% to-[#062243] to-100% bg-no-repeat'
				}
			>
				<ApplicationProviders>{children}</ApplicationProviders>
				<Script
					src="https://telegram.org/js/telegram-web-app.js"
					strategy={'beforeInteractive'}
				/>
			</body>
		</html>
	);
}
