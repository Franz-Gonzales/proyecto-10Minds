import { Inject, Injectable } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';
import { GameCategory } from '../../domain/enums/game-category.enum';

export interface GetAllGamesQuery {
    category?: GameCategory;
}

@Injectable()
export class GetAllGamesUseCase {
    constructor(
        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
    ) { }

    async execute(query: GetAllGamesQuery = {}): Promise<Game[]> {
        return this.gameRepository.findAll({
            category: query.category,
            includeDeleted: false
        });
    }
}