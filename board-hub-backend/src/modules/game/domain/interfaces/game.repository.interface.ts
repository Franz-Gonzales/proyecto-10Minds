import { Game } from '../entities/game.entity';

export const GAME_REPOSITORY = Symbol('GAME_REPOSITORY');

export interface FindAllGamesOptions {
    categoryId?: string;
    includeDeleted?: boolean;
}

export interface IGameRepository {
    create(game: Game): Promise<Game>;
    findAll(options?: FindAllGamesOptions): Promise<Game[]>;
    findById(id: string): Promise<Game | null>;
    findByTitle(title: string): Promise<Game | null>;
    findByCategoryId(categoryId: string): Promise<Game[]>;
    update(id: string, partial: Partial<Game>): Promise<Game>;
    delete(id: string): Promise<void>;
}