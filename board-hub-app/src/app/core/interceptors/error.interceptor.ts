import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

const GRAPHQL_ERROR_CODES: Record<string, string> = {
  GAME_NOT_FOUND:      'Game not found.',
  CLIENT_NOT_FOUND:    'Client not found.',
  LOAN_NOT_FOUND:      'Loan not found.',
  INSUFFICIENT_STOCK:  'Insufficient stock to complete the loan.',
  INVALID_DATE_RANGE:  'The end date must be after the start date.',
  ALREADY_RETURNED:    'This loan has already been returned.',
  ALREADY_DELETED:     'This record has already been deleted.',
  ALREADY_EXISTS:      'This record already exists.',
  INVALID_DATA:        'Invalid data.',
};

export const graphqlErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((err) => {
      const message =
        err?.error?.message ??
        err?.message ??
        'Error connecting to the server. Verify that the server is running.';

      notification.error(message);
      return throwError(() => err);
    }),
  );
};

export function extractGraphQLError(error: unknown): string {
  const graphqlErrors = (error as any)?.graphQLErrors ?? [];

  if (graphqlErrors.length > 0) {
    const code = graphqlErrors[0]?.extensions?.code as string;
    return GRAPHQL_ERROR_CODES[code] ?? graphqlErrors[0]?.message ?? 'Unknown error.';
  }

  const networkError = (error as any)?.networkError;
  if (networkError) {
    return 'Network error. Check your connection.';
  }

  return 'Unknown error occurred.';
}
