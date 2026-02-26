import { Game } from '../../../../domain/entities/game.entity';
import { GameOrmEntity } from '../entities/game.orm-entity';

export class GameMapper {

    /**
     * toDomain (BD → Negocio): Cuando sacas datos de la base de datos, 
     * el Mapper los transforma en una entidad de Dominio para que 
     * tus Casos de Uso puedan trabajar con ellos.
     * * */
    static toDomain(ormEntity: GameOrmEntity): Game {
        return new Game({
            id: ormEntity.id,
            title: ormEntity.title,
            category: ormEntity.category,
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

    /**
     * toOrm (Negocio → BD): Cuando quieres guardar algo, el Mapper 
     * toma tu entidad de negocio y la convierte al 
     * formato que TypeORM entiende.
     * * */

    static toOrm(domain: Game): GameOrmEntity {
        const ormEntity = new GameOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.title = domain.title;
        ormEntity.category = domain.category;
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