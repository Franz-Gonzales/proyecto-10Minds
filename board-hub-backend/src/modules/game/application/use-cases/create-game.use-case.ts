import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Game } from '../../domain/entities/game.entity';
import { GameAlreadyExistsException, InvalidGameDataException } from '../../domain/exceptions/game.exceptions';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';
import { CATEGORY_REPOSITORY } from '../../../category/domain/interfaces/category.repository.interface';
import type { ICategoryRepository } from '../../../category/domain/interfaces/category.repository.interface';
import { CategoryNotFoundException, CategoryInactiveException } from '../../../category/domain/exceptions/category.exceptions';

export interface CreateGameCommand {
    title: string;
    categoryId: string;
    description?: string | null;
    pricePerDay: number;
    minPlayers: number;
    maxPlayers: number;
    durationMinutes: number;
    stockTotal: number;
    imageUrl?: string | null;
}


@Injectable()
export class CreateGameUseCase {
    constructor(
        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(command: CreateGameCommand): Promise<Game> {

        if (command.minPlayers > command.maxPlayers) {
            throw new InvalidGameDataException('minPlayers cannot be greater than maxPlayers');
        }

        if (command.stockTotal < 1) {
            throw new InvalidGameDataException('stockTotal must be at least 1');
        }

        // Validate that the category exists and is active
        const category = await this.categoryRepository.findById(command.categoryId);
        if (!category) {
            throw new CategoryNotFoundException(command.categoryId);
        }
        if (!category.isActive) {
            throw new CategoryInactiveException(command.categoryId);
        }

        // Validate unique title
        const existingGame = await this.gameRepository.findByTitle(command.title);
        if (existingGame) {
            throw new GameAlreadyExistsException(command.title);
        }

        const game = new Game({
            id: uuidv4(),
            title: command.title,
            categoryId: command.categoryId,
            description: command.description ?? null,
            pricePerDay: command.pricePerDay,
            minPlayers: command.minPlayers,
            maxPlayers: command.maxPlayers,
            durationMinutes: command.durationMinutes,
            stockTotal: command.stockTotal,
            stockAvailable: command.stockTotal,
            imageUrl: command.imageUrl ?? null,
        });

        return this.gameRepository.create(game);
    }
}