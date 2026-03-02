import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { createApolloOptions } from './core/graphql/apollo.config';
import { graphqlErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular zoneless
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),

    // Router
    provideRouter(routes, withComponentInputBinding()),

    // Animaciones Material
    provideAnimationsAsync(),

    // HTTP client + global error interceptor
    provideHttpClient(withInterceptors([graphqlErrorInterceptor])),

    // Apollo Client + apollo-angular
    provideApollo(createApolloOptions),
  ],
};
