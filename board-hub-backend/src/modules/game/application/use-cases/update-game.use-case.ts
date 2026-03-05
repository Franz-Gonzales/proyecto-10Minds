import { Inject, Injectable } from '@nestjs/common';

import { Game } from '../../domain/entities/game.entity';
import {
    GameNotFoundException,
    InvalidGameDataException,
} from '../../domain/exceptions/game.exceptions';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';
import { CATEGORY_REPOSITORY } from '../../../category/domain/interfaces/category.repository.interface';
import type { ICategoryRepository } from '../../../category/domain/interfaces/category.repository.interface';
import { CategoryNotFoundException, CategoryInactiveException } from '../../../category/domain/exceptions/category.exceptions';

export interface UpdateGameCommand {
    title?: string;
    categoryId?: string;
    description?: string | null;
    pricePerDay?: number;
    minPlayers?: number;
    maxPlayers?: number;
    durationMinutes?: number;
    stockTotal?: number;
    imageUrl?: string | null;
}

@Injectable()
export class UpdateGameUseCase {
    constructor(
        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(id: string, command: UpdateGameCommand): Promise<Game> {
        const existGame = await this.gameRepository.findById(id);

        if (!existGame) {
            throw new GameNotFoundException(id);
        }

        if (command.title && command.title !== existGame.title) {
            const existingGame = await this.gameRepository.findByTitle(command.title);
            if (existingGame) {
                throw new InvalidGameDataException('A game with this title already exists');
            }
        }

        // Validar categoría si se está actualizando
        if (command.categoryId) {
            const category = await this.categoryRepository.findById(command.categoryId);
            if (!category) {
                throw new CategoryNotFoundException(command.categoryId);
            }
            if (!category.isActive) {
                throw new CategoryInactiveException(command.categoryId);
            }
        }

        // Validaciones de jugadores
        const minPlayers = command.minPlayers ?? existGame.minPlayers;
        const maxPlayers = command.maxPlayers ?? existGame.maxPlayers;

        if (minPlayers > maxPlayers) {
            throw new InvalidGameDataException('minPlayers cannot be greater than maxPlayers');
        }

        // Lógica de Stock
        let newStockAvailable = existGame.stockAvailable;

        if (command.stockTotal !== undefined && command.stockTotal !== existGame.stockTotal) {
            const stockDifference = command.stockTotal - existGame.stockTotal;
            newStockAvailable = existGame.stockAvailable + stockDifference;

            if (newStockAvailable < 0) {
                throw new InvalidGameDataException(
                    'stockTotal cannot be less than the number of currently rented games',
                );
            }
        }

        const updateData: Partial<Game> = {
            ...command,
            stockAvailable: newStockAvailable,
        };

        return await this.gameRepository.update(id, updateData);
    }
}