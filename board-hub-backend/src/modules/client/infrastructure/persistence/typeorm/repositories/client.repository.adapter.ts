import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IClientRepository } from "../../../../domain/interfaces/client.repository.interface";
import { ClientOrmEntity } from "../entities/client.orm-entity";
import { Client } from "../../../../domain/entities/client.entity";
import { ClientMapper } from "../mappers/client.mapper";

@Injectable()
export class ClientRepositoryAdapter implements IClientRepository {
    constructor(
        @InjectRepository(ClientOrmEntity)
        private readonly ormRepository: Repository<ClientOrmEntity>,
    ) { }

    async create(client: Client): Promise<Client> {
        const ormEntity = ClientMapper.toOrm(client);
        const saved = await this.ormRepository.save(ormEntity);
        return ClientMapper.toDomain(saved);
    }

    async findAll(): Promise<Client[]> {
        const entities = await this.ormRepository.find({
            order: { createdAt: 'DESC' },
        });
        return entities.map(ClientMapper.toDomain);
    }

    async findById(id: string): Promise<Client | null> {
        const entity = await this.ormRepository.findOne({
            where: { id },
        });

        if (!entity) return null;

        return ClientMapper.toDomain(entity);
    }

    async findByPhoneNumber(phoneNumber: string): Promise<Client | null> {
        const entity = await this.ormRepository.findOne({
            where: { phoneNumber, isActive: true },
        });

        if (!entity) return null;

        return ClientMapper.toDomain(entity);
    }

    async findByEmail(email: string): Promise<Client | null> {
        const entity = await this.ormRepository.findOne({
            where: { email, isActive: true },
        });

        if (!entity) return null;

        return ClientMapper.toDomain(entity);
    }

    async findByCI(ci: string): Promise<Client | null> {
        const entity = await this.ormRepository.findOne({
            where: { ci, isActive: true },
        });

        if (!entity) return null;

        return ClientMapper.toDomain(entity);
    }

    async update(id: string, partial: Partial<Client>): Promise<Client> {
        await this.ormRepository.update(id, {
            ...partial,
            updatedAt: new Date(),
        } as any);

        const updated = await this.ormRepository.findOneBy({ id });

        if (!updated) {
            throw new Error(`Client with id "${id}" not found after update`);
        }

        return ClientMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.update(id, {
            isActive: false,
            deletedAt: new Date(),
        } as any);
    }
}