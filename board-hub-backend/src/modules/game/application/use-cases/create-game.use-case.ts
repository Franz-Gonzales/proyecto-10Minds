import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Game } from '../../domain/entities/game.entity';
import { GameCategory } from '../../domain/enums/game-category.enum';
import { GameAlreadyExistsException, InvalidGameDataException } from '../../domain/exceptions/game.exceptions';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';


export interface CreateGameCommand {
    title: string;
    category: GameCategory;
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
    ) { }

    async execute(command: CreateGameCommand): Promise<Game> {

        if (command.minPlayers > command.maxPlayers) {
            throw new InvalidGameDataException('minPlayers cannot be greater than maxPlayers');
        }

        if (command.stockTotal < 1) {
            throw new InvalidGameDataException('stockTotal must be at least 1');
        }

        const existingGames = await this.gameRepository.findByTitle(command.title);
        if (existingGames) {
            throw new GameAlreadyExistsException(command.title);
        }

        const game = new Game({
            id: uuidv4(),
            title: command.title,
            category: command.category,
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