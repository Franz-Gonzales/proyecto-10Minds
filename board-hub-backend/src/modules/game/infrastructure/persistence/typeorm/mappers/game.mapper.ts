import { Game } from '../../../../domain/entities/game.entity';
import { GameOrmEntity } from '../entities/game.orm-entity';

export class GameMapper {
    static toDomain(ormEntity: GameOrmEntity): Game {
        return new Game({
            id: ormEntity.id,
            title: ormEntity.title,
            categoryId: ormEntity.categoryId,
            description: ormEntity.description,
            pricePerDay: Number(ormEntity.pricePerDay),
            minPlayers: ormEntity.minPlayers,
            maxPlayers: ormEntity.maxPlayers,
            durationMinutes: ormEntity.durationMinutes,
            stockTotal: ormEntity.stockTotal,
            stockAvailable: ormEntity.stockAvailable,
            imageUrl: ormEntity.imageUrl,
            isDeleted: ormEntity.isDeleted,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        });
    }

    static toOrm(domain: Game): GameOrmEntity {
        const ormEntity = new GameOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.title = domain.title;
        ormEntity.categoryId = domain.categoryId;
        ormEntity.description = domain.description;
        ormEntity.pricePerDay = domain.pricePerDay;
        ormEntity.minPlayers = domain.minPlayers;
        ormEntity.maxPlayers = domain.maxPlayers;
        ormEntity.durationMinutes = domain.durationMinutes;
        ormEntity.stockTotal = domain.stockTotal;
        ormEntity.stockAvailable = domain.stockAvailable;
        ormEntity.imageUrl = domain.imageUrl;
        ormEntity.isDeleted = domain.isDeleted;
        return ormEntity;
    }

    static toOrmPartial(partial: Partial<Game>): Partial<GameOrmEntity> {
        const ormPartial: Partial<GameOrmEntity> = {};
        if (partial.title !== undefined) ormPartial.title = partial.title;
        if (partial.categoryId !== undefined) ormPartial.categoryId = partial.categoryId;
        if (partial.description !== undefined) ormPartial.description = partial.description;
        if (partial.pricePerDay !== undefined) ormPartial.pricePerDay = partial.pricePerDay;
        if (partial.minPlayers !== undefined) ormPartial.minPlayers = partial.minPlayers;
        if (partial.maxPlayers !== undefined) ormPartial.maxPlayers = partial.maxPlayers;
        if (partial.durationMinutes !== undefined) ormPartial.durationMinutes = partial.durationMinutes;
        if (partial.stockTotal !== undefined) ormPartial.stockTotal = partial.stockTotal;
        if (partial.stockAvailable !== undefined) ormPartial.stockAvailable = partial.stockAvailable;
        if (partial.imageUrl !== undefined) ormPartial.imageUrl = partial.imageUrl;
        if (partial.isDeleted !== undefined) ormPartial.isDeleted = partial.isDeleted;
        return ormPartial;
    }
}