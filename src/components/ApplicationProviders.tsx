'use client';

import { PropsWithChildren, useRef } from 'react';
import { ModalContextProvider } from '@/contexts/ModalContext';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/api/graphql';
import { Provider } from 'react-redux';
import { AppStore, createStore } from '@/store';
import { AppContextProvider } from '@/contexts/AppContext';

export function ApplicationProviders({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<AppStore>();

	if (!storeRef.current) {
		storeRef.current = createStore();
	}

	return (
		<ApolloProvider client={apolloClient}>
			<Provider store={storeRef.current!}>
				<ModalContextProvider>
					<AppContextProvider>{children}</AppContextProvider>
				</ModalContextProvider>
			</Provider>
		</ApolloProvider>
	);
}
