import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphqlClientService {
  private readonly apollo = inject(Apollo);

  // Método para consultas (queries) normales
  query<T>(query: DocumentNode, variables?: Record<string, unknown>): Observable<T> {
    return this.apollo
      .query<T>({ query, variables })
      .pipe(map((result) => result.data!));
  }

  // Método para consultas reactivas (watchQuery)
  watchQuery<T>(query: DocumentNode, variables?: Record<string, unknown>): Observable<T> {
    return this.apollo
      .watchQuery<T>({ query, variables })
      .valueChanges.pipe(map((result) => result.data as T));
  }

  // Método para mutaciones (create, update, delete)
  mutate<T>(mutation: DocumentNode, variables?: Record<string, unknown>): Observable<T> {
    return this.apollo
      .mutate<T>({ mutation, variables })
      .pipe(map((result) => result.data as T));
  }
}
