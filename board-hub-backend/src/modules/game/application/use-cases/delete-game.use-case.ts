import { Inject, Injectable } from '@nestjs/common';

import { GameNotFoundException } from '../../domain/exceptions/game.exceptions';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';

@Injectable()
export class DeleteGameUseCase {
    constructor(
        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
    ) {}

    async execute(id: string): Promise<boolean> {
        const existGame = await this.gameRepository.findById(id);

        if (!existGame) {
            throw new GameNotFoundException(id);
        }

        await this.gameRepository.delete(id);
        return true;
    }
}