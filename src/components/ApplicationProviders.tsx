'use client';

import { PropsWithChildren } from 'react';
import { UserContextProvider } from '@/contexts/UserContext';
import { ApplicationContextProvider } from '@/contexts/ApplicationContext/ApplicationContext';
import { ModalContextProvider } from '@/contexts/ModalContext';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/api/graphql';

export function ApplicationProviders({ children }: PropsWithChildren<{}>) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserContextProvider>
        <ApplicationContextProvider>
          <ModalContextProvider>{children}</ModalContextProvider>
        </ApplicationContextProvider>
      </UserContextProvider>
    </ApolloProvider>
  );
}
