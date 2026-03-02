import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { environment } from '../../../environments/environment';

export function createApolloOptions(): ApolloClientOptions {
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri: environment.graphqlUrl }),
    cache: new InMemoryCache({
      typePolicies: {
        Game: { keyFields: ['id'] },
        Client: { keyFields: ['id'] },
        Loan: { keyFields: ['id'] },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  };
}
