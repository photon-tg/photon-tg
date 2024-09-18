import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	defaultDataIdFromObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { supabase } from './supabase';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

const cache = new InMemoryCache({
	dataIdFromObject(responseObject) {
		if ('nodeId' in responseObject) {
			return `${responseObject.nodeId}`;
		}

		return defaultDataIdFromObject(responseObject);
	},
});

const httpLink = createHttpLink({
	uri: 'https://hnvngbrjzbcenxwmzzrk.supabase.co/graphql/v1',
});

const authLink = setContext(async (_, { headers }) => {
	const token = (await supabase.auth.getSession()).data.session?.access_token;

	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : '',
			apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		},
	};
});

if (process.env.NODE_ENV === 'development') {
	// Adds messages only in a dev environment
	loadDevMessages();
	loadErrorMessages();
}

const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache,
});

export default apolloClient;
