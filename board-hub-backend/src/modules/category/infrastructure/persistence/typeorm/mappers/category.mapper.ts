import { CategoryOrmEntity } from "../entities/category.orm-entity";
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
        ormEntity.deletedAt = domain.deletedAt;
        return ormEntity;
    }

    static toOrmPartial(partial: Partial<Category>): Partial<CategoryOrmEntity> {
        const ormPartial: Partial<CategoryOrmEntity> = {};
        if (partial.name !== undefined) ormPartial.name = partial.name;
        if (partial.description !== undefined) ormPartial.description = partial.description;
        if (partial.icon !== undefined) ormPartial.icon = partial.icon;
        if (partial.isActive !== undefined) ormPartial.isActive = partial.isActive;
        if (partial.deletedAt !== undefined) ormPartial.deletedAt = partial.deletedAt;
        return ormPartial;
    }
}