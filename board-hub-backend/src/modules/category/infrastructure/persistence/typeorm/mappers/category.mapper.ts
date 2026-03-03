import { CategoryOrmEntity } from "../entities/category.orm-entitie";
import { Category } from '../../../../domain/entities/category.entity';

export class CategoryMapper {

    static toDomain(ormEntity: CategoryOrmEntity): Category {
        return new Category({
            id: ormEntity.id,
            name: ormEntity.name,
            description: ormEntity.description,
            icon: ormEntity.icon,
            isActive: ormEntity.isActive,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            deletedAt: ormEntity.deletedAt,
        });
    }

    static toOrm(domain: Category): CategoryOrmEntity {
        const ormEntity = new CategoryOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.name = domain.name;
        ormEntity.description = domain.description;
        ormEntity.icon = domain.icon;
        ormEntity.isActive = domain.isActive;
        return ormEntity;
    }
}