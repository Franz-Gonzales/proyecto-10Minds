import { Inject, Injectable } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import { GAME_REPOSITORY } from '../../domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../domain/interfaces/game.repository.interface';


@Injectable()
export class GetAllGamesUseCase {
    constructor(
        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
    ) { }

    async execute(): Promise<Game[]> {
        return this.gameRepository.findAll();
    }
}