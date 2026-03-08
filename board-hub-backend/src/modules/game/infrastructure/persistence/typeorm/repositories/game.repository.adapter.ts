import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from '../../../../domain/entities/game.entity';
import { FindAllGamesOptions, IGameRepository } from '../../../../domain/interfaces/game.repository.interface';
import { GameOrmEntity } from '../entities/game.orm-entity';
import { GameMapper } from '../mappers/game.mapper';

@Injectable()
export class GameRepositoryAdapter implements IGameRepository {
    constructor(
        @InjectRepository(GameOrmEntity)
        private readonly ormRepository: Repository<GameOrmEntity>,
    ) { }

    async create(game: Game): Promise<Game> {
        const ormEntity = GameMapper.toOrm(game);
        const saved = await this.ormRepository.save(ormEntity);
        return GameMapper.toDomain(saved);
    }

    async findAll(options: FindAllGamesOptions = {}): Promise<Game[]> {
        const qb = this.ormRepository.createQueryBuilder('game');

        if (!options.includeDeleted) {
            qb.where('game.isDeleted = :isDeleted', { isDeleted: false });
        }

        if (options.categoryId) {
            qb.andWhere('game.categoryId = :categoryId', { categoryId: options.categoryId });
        }

        qb.orderBy('game.createdAt', 'DESC');

        const entities = await qb.getMany();
        return entities.map(GameMapper.toDomain);
    }

    async findById(id: string): Promise<Game | null> {
        const entity = await this.ormRepository.findOne({
            where: { id },
        });

        if (!entity) return null;

        return GameMapper.toDomain(entity);
    }

    async findByTitle(title: string): Promise<Game | null> {
        const entity = await this.ormRepository.findOne({
            where: { title, isDeleted: false },
        });

        if (!entity) return null;

        return GameMapper.toDomain(entity);
    }

    async findByCategoryId(categoryId: string): Promise<Game[]> {
        const entities = await this.ormRepository.find({
            where: { categoryId, isDeleted: false },
            order: { createdAt: 'DESC' },
        });

        return entities.map(GameMapper.toDomain);
    }

    async update(id: string, partial: Partial<Game>): Promise<Game> {
        const entity = await this.ormRepository.findOne({ where: { id } });

        if (!entity) {
            throw new Error(`Game with id "${id}" not found in database`);
        }

        const mappedPartial = GameMapper.toOrmPartial(partial);
        const updatedEntity = this.ormRepository.merge(entity, mappedPartial);
        const saved = await this.ormRepository.save(updatedEntity);
        return GameMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.update(id, {
            isDeleted: true,
            updatedAt: new Date(),
        });
    }
}