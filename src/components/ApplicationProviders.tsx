'use client';

import { PropsWithChildren, useRef } from 'react';
import { ModalContextProvider } from '@/contexts/ModalContext';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/api/graphql';
import { Provider } from 'react-redux';
import { AppStore, createStore } from '@/store';
import { AppContextProvider } from '@/contexts/AppContext';
import { Locale } from '../../i18n-config';
import { IntlProvider } from 'react-intl';
import { getTranslations } from '@/model/localization/utils';
import { BATTLES_QUERYResult } from '../../sanity/types';

export interface ApplicationProvidersProps {
	lang: Locale;
	battlesContent: BATTLES_QUERYResult;
}

export function ApplicationProviders({
	children,
	lang,
	battlesContent,
}: PropsWithChildren<ApplicationProvidersProps>) {
	const storeRef = useRef<AppStore>(null);

	if (!storeRef.current) {
		storeRef.current = createStore();
	}

	return (
		<IntlProvider
			defaultLocale={'en'}
			locale={lang}
			messages={getTranslations(lang)}
		>
			<ApolloProvider client={apolloClient}>
				<Provider store={storeRef.current!}>
					<AppContextProvider battlesContent={battlesContent} lang={lang}>
						<ModalContextProvider>{children}</ModalContextProvider>
					</AppContextProvider>
				</Provider>
			</ApolloProvider>
		</IntlProvider>
	);
}
