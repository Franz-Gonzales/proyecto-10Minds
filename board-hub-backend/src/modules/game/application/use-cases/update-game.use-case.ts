import { Inject, Injectable } from '@nestjs/common';

import { Game } from '../../domain/entities/game.entity';
import { GameCategory } from '../../domain/enums/game-category.enum';
import {
    GameNotFoundException,
    InvalidGameDataException,
} from '../../domain/exceptions/game.exceptions';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';

export interface UpdateGameCommand {
    title?: string;
    category?: GameCategory;
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
    ) { }

    async execute(id: string, command: UpdateGameCommand): Promise<Game> {
        const existGame = await this.gameRepository.findById(id);

        if (!existGame) {
            throw new GameNotFoundException(id);
        }

        // Validaciones previas
        const minPlayers = command.minPlayers ?? existGame.minPlayers;
        const maxPlayers = command.maxPlayers ?? existGame.maxPlayers;

        if (minPlayers > maxPlayers) {
            throw new InvalidGameDataException('minPlayers cannot be greater than maxPlayers');
        }

        // Lógica de Stock (Calculamos antes de crear el objeto)
        let newStockAvailable = existGame.stockAvailable; // exit=20  new=30  = 30 - 20 =  dif=>10 new=20 + 10 = 30

        if (command.stockTotal !== undefined && command.stockTotal !== existGame.stockTotal) {
            const stockDifference = command.stockTotal - existGame.stockTotal;
            newStockAvailable = existGame.stockAvailable + stockDifference;

            if (newStockAvailable < 0) {
                throw new InvalidGameDataException(
                    'stockTotal cannot be less than the number of currently rented games'
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