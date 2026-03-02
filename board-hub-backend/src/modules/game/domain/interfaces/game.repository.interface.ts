import { Game } from '../entities/game.entity';
import { GameCategory } from '../enums/game-category.enum';

export const GAME_REPOSITORY = Symbol('GAME_REPOSITORY');

export interface FindAllGamesOptions {
    category?: GameCategory;
    includeDeleted?: boolean;
}

export interface IGameRepository {
    create(game: Game): Promise<Game>;
    findAll(options?: FindAllGamesOptions): Promise<Game[]>;
    findById(id: string): Promise<Game | null>;
    findByTitle(title: string): Promise<Game | null>;
    update(id: string, partial: Partial<Game>): Promise<Game>;
    delete(id: string): Promise<void>;
}