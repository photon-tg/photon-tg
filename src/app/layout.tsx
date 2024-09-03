import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

import { ApplicationProviders } from '@/components/ApplicationProviders';
import { GoogleAnalytics } from '@next/third-parties/google';

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
			<body
				className={
					'h-full bg-gradient-to-b from-saturated-blue from-0% to-dark-black to-100% bg-no-repeat'
				}
			>
				<ApplicationProviders>{children}</ApplicationProviders>
				<Script
					src="https://telegram.org/js/telegram-web-app.js"
					strategy={'beforeInteractive'}
				/>
			<Script
				id={'gtm'}
				strategy={'beforeInteractive'}
				dangerouslySetInnerHTML={{
					__html: `<!-- Google Tag Manager -->
						<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','GTM-59KV2HBP');</script>
						<!-- End Google Tag Manager -->`
				}}
			/>
			<Script
				id={'gtm-noscript'}
				strategy={'beforeInteractive'}
				dangerouslySetInnerHTML={{
					__html: `<!-- Google Tag Manager (noscript) -->
						<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-59KV2HBP"
						height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
						<!-- End Google Tag Manager (noscript) -->`
				}}
			/>
			</body>
		</html>
	);
}
