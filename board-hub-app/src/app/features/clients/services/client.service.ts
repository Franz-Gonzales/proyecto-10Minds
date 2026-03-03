import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GraphqlClientService } from '../../../core/graphql/graphql-client.service';
import { GET_ALL_CLIENTS, GET_CLIENT_BY_ID } from '../graphql/client.queries';
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../graphql/client.mutations';
import { Client, CreateClientInput, UpdateClientInput } from '../models/client.model';

interface GetAllClientsResponse {
  clients: Client[];
}

interface GetClientByIdResponse {
  client: Client;
}

interface CreateClientResponse {
  createClient: Client;
}

interface UpdateClientResponse {
  updateClient: Client;
}

interface DeleteClientResponse {
  removeClient: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly graphql = inject(GraphqlClientService);

  getAll(): Observable<Client[]> {
    return this.graphql
      .query<GetAllClientsResponse>(GET_ALL_CLIENTS)
      .pipe(map((res) => res.clients));
  }

  getById(id: string): Observable<Client> {
    return this.graphql
      .query<GetClientByIdResponse>(GET_CLIENT_BY_ID, { id })
      .pipe(map((res) => res.client));
  }

  create(input: CreateClientInput): Observable<Client> {
    return this.graphql
      .mutate<CreateClientResponse>(CREATE_CLIENT, { createClientInput: input })
      .pipe(map((res) => res.createClient));
  }

  update(input: UpdateClientInput): Observable<Client> {
    return this.graphql
      .mutate<UpdateClientResponse>(UPDATE_CLIENT, { updateClientInput: input })
      .pipe(map((res) => res.updateClient));
  }

  delete(id: string): Observable<boolean> {
    return this.graphql
      .mutate<DeleteClientResponse>(DELETE_CLIENT, { id })
      .pipe(map((res) => res.removeClient));
  }
}