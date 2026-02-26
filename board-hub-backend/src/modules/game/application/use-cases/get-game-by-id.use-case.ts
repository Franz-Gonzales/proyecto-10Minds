import { Inject, Injectable } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import { GameNotFoundException } from '../../domain/exceptions/game.exceptions';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';


@Injectable()
export class GetGameByIdUseCase {
    constructor(
        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
    ) { }

    async execute(id: string): Promise<Game> {
        const game = await this.gameRepository.findById(id);

        if (!game) {
            throw new GameNotFoundException(id);
        }

        return game;
    }
}