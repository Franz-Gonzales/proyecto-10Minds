import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { GamesService } from '../../../application/services/games.service';
import { GameType } from '../types/game.type';
import { CreateGameInput } from '../inputs/create-game.input';
import { UpdateGameInput } from '../inputs/update-game.input';
import { GameCategory } from '../../../domain/enums/game-category.enum';
import { Game } from '../../../domain/entities/game.entity';

@Resolver(() => GameType)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
  ) { }

  @Mutation(() => GameType, { name: 'createGame' })
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gamesService.create(createGameInput);
  }

  @Query(() => [GameType], { name: 'games' })
  async findAll(
    @Args('category', { type: () => GameCategory, nullable: true }) category?: GameCategory,
  ): Promise<Game[]> {
    return this.gamesService.findAll({ category });
  }

  @Query(() => GameType, { name: 'game' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Game> {
    return this.gamesService.findOne(id);
  }

  @Mutation(() => GameType, { name: 'updateGame' })
  async updateGame(
    @Args('updateGameInput') updateGameInput: UpdateGameInput,
  ): Promise<Game> {
    const { id, ...data } = updateGameInput;
    return this.gamesService.update(id, data);
  }

  @Mutation(() => Boolean, { name: 'deleteGame' })
  async deleteGame(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.gamesService.remove(id);
  }
}