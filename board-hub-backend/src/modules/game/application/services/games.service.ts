import { Injectable } from '@nestjs/common';

import { Game } from '../../domain/entities/game.entity';
import { CreateGameUseCase, CreateGameCommand } from '../use-cases/create-game.use-case';
import { GetAllGamesUseCase } from '../use-cases/get-all-games.use-case';
import { GetGameByIdUseCase } from '../use-cases/get-game-by-id.use-case';
import { UpdateGameUseCase, UpdateGameCommand } from '../use-cases/update-game.use-case';
import { DeleteGameUseCase } from '../use-cases/delete-game.use-case';

@Injectable()
export class GamesService {
  constructor(
    private readonly createGameUseCase: CreateGameUseCase,
    private readonly getAllGamesUseCase: GetAllGamesUseCase,
    private readonly getGameByIdUseCase: GetGameByIdUseCase,
    private readonly updateGameUseCase: UpdateGameUseCase,
    private readonly deleteGameUseCase: DeleteGameUseCase,
  ) { }


  async create(command: CreateGameCommand): Promise<Game> {
    return this.createGameUseCase.execute(command);
  }

  async findAll(): Promise<Game[]> {
    return this.getAllGamesUseCase.execute();
  }

  async findOne(id: string): Promise<Game> {
    return this.getGameByIdUseCase.execute(id);
  }

  async update(id: string, command: UpdateGameCommand): Promise<Game> {
    return this.updateGameUseCase.execute(id, command);
  }

  async remove(id: string): Promise<boolean> {
    return this.deleteGameUseCase.execute(id);
  }
}
