import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CategoryOrmEntity } from "../entities/category.orm-entity";
import { CategoryMapper } from "../mappers/category.mapper";
import { CategoryNotFoundException } from '../../../../domain/exceptions/category.exceptions';
import { Category } from '../../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../../domain/interfaces/category.repository.interface';

@Injectable()
export class CategoryRepositoryAdapter implements ICategoryRepository {
    constructor(
        @InjectRepository(CategoryOrmEntity)
        private readonly ormRepository: Repository<CategoryOrmEntity>,
    ) { }

    async create(category: Category): Promise<Category> {
        const ormEntity = CategoryMapper.toOrm(category);
        const saved = await this.ormRepository.save(ormEntity);
        return CategoryMapper.toDomain(saved);
    }

    async findAll(): Promise<Category[]> {
        const entities = await this.ormRepository.find({
            order: { createdAt: 'DESC' },
        });
        return entities.map(CategoryMapper.toDomain);
    }

    async findById(id: string): Promise<Category | null> {
        const entity = await this.ormRepository.findOne({
            where: { id },
        });

        if (!entity) return null;

        return CategoryMapper.toDomain(entity);
    }

    async findByName(name: string): Promise<Category | null> {
        const entity = await this.ormRepository.findOne({
            where: { name, isActive: true },
        });

        if (!entity) return null;

        return CategoryMapper.toDomain(entity);
    }

    async update(id: string, partial: Partial<Category>): Promise<Category> {
        const entity = await this.ormRepository.findOne({
            where: { id },
        });

        if (!entity) throw new CategoryNotFoundException(id);

        const mappedPartial = CategoryMapper.toOrmPartial(partial);

        const updatedEntity = this.ormRepository.merge(entity, mappedPartial);
        const saved = await this.ormRepository.save(updatedEntity);
        return CategoryMapper.toDomain(saved);
    }

    async delete(id: string): Promise<boolean> {
        const entity = await this.ormRepository.findOne({ where: { id } });
        if (!entity) throw new CategoryNotFoundException(id);

        // Marcamos como borrado suave
        const result = await this.ormRepository.softDelete(id);
        if (result.affected && result.affected > 0) {
            // Cambiamos isActive a false antes del soft-delete
            await this.ormRepository.update(id, { isActive: false });
            return true;
        }

        return false;
    }

    async restore(id: string): Promise<boolean> {
        // Restauramos el registro en la db
        const result = await this.ormRepository.restore(id);

        // Si además usas isActive, lo volvemos a poner en true
        if (result.affected && result.affected > 0) {
            await this.ormRepository.update(id, { isActive: true });
            return true;
        }

        return false;
    }
}