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
}