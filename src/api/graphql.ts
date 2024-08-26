import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  defaultDataIdFromObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { supabase } from './supabase';

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

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default apolloClient;
