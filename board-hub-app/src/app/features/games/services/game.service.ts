import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GraphqlClientService } from '../../../core/graphql/graphql-client.service';
import { GET_ALL_GAMES, GET_GAME_BY_ID } from '../graphql/games.queries';
import { CREATE_GAME, DELETE_GAME, UPDATE_GAME } from '../graphql/games.mutations';
import { CreateGameInput, Game, GameCategory, UpdateGameInput } from '../models/game.model';

interface GetAllGamesResponse {
  games: Game[];
}

interface GetGameByIdResponse {
  game: Game;
}

interface CreateGameResponse {
  createGame: Game;
}

interface UpdateGameResponse {
  updateGame: Game;
}

interface DeleteGameResponse {
  deleteGame: boolean;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly graphql = inject(GraphqlClientService);

  getAll(category?: GameCategory): Observable<Game[]> {
    return this.graphql
      .query<GetAllGamesResponse>(GET_ALL_GAMES, {
        category: category ?? null,
      })
      .pipe(map((data) => data.games));
  }

  getById(id: string): Observable<Game> {
    return this.graphql
      .query<GetGameByIdResponse>(GET_GAME_BY_ID, { id })
      .pipe(map((data) => data.game));
  }

  create(input: CreateGameInput): Observable<Game> {
    return this.graphql
      .mutate<CreateGameResponse>(CREATE_GAME, { createGameInput: input })
      .pipe(map((data) => data.createGame));
  }

  update(input: UpdateGameInput): Observable<Game> {
    return this.graphql
      .mutate<UpdateGameResponse>(UPDATE_GAME, { updateGameInput: input })
      .pipe(map((data) => data.updateGame));
  }

  delete(id: string): Observable<boolean> {
    return this.graphql
      .mutate<DeleteGameResponse>(DELETE_GAME, { id })
      .pipe(map((data) => data.deleteGame));
  }
}
