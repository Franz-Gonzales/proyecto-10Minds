import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from '../../../../domain/entities/game.entity';
import { IGameRepository } from '../../../../domain/interfaces/game.repository.interface';
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

    async findAll(): Promise<Game[]> {
        const entities = await this.ormRepository.find({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
        });
        return entities.map(GameMapper.toDomain);
    }

    async findById(id: string): Promise<Game | null> {
        const entity = await this.ormRepository.findOne({
            where: { id, isDeleted: false },
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

    async update(id: string, partial: Partial<Game>): Promise<Game> {
        await this.ormRepository.update(id, {
            ...partial,
            updatedAt: new Date(),
        } as any);

        const updated = await this.ormRepository.findOneBy({ id });

        if (!updated) {
            throw new Error(`Game with id ${id} not found after update`);
        }

        return GameMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.update(id, {
            isDeleted: true,
            updatedAt: new Date(),
        });
    }
}