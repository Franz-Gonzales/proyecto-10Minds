import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';

import { GamesService } from '../../../application/services/games.service';
import { GameType } from '../types/game.type';
import { CreateGameInput } from '../inputs/create-game.input';
import { UpdateGameInput } from '../inputs/update-game.input';
import { Game } from '../../../domain/entities/game.entity';
import { CategoryType } from '../../../../category/presentation/graphql/types/category.type';
import { CategoryService } from '../../../../category/application/services/category.service';
import { Category } from '../../../../category/domain/entities/category.entity';

@Resolver(() => GameType)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly categoryService: CategoryService,
  ) { }

  @Mutation(() => GameType, { name: 'createGame' })
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gamesService.create(createGameInput);
  }

  @Query(() => [GameType], { name: 'games' })
  async findAll(
    @Args('categoryId', { type: () => ID, nullable: true }) categoryId?: string,
  ): Promise<Game[]> {
    return this.gamesService.findAll({ categoryId });
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

  @ResolveField('category', () => CategoryType, { nullable: true })
  async resolveCategory(@Parent() game: Game): Promise<Category | null> {
    if (!game.categoryId) return null;

    try {
      return await this.categoryService.findOne(game.categoryId);
    } catch {
      return null;
    }
  }
}