import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { UserContextProvider } from '@/contexts/UserContext';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext/ApplicationContext';
import { ModalContextProvider } from '@/contexts/ModalContext';
import { GoogleAnalytics } from '@next/third-parties/google'

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
}

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
        <UserContextProvider>
          <ApplicationContextProvider>
            <ModalContextProvider>
              {children}
            </ModalContextProvider>
          </ApplicationContextProvider>
        </UserContextProvider>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy={'beforeInteractive'}
        />
        <GoogleAnalytics gaId='G-SQ0XS74EJ2' />
      </body>
    </html>
  );
}
