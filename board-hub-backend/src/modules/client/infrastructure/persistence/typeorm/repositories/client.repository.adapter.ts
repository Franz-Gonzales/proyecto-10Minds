import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
    IClientRepository,
    FindAllPaginatedOptions,
    PaginatedClients,
} from "../../../../domain/interfaces/client.repository.interface";
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
        where: { isActive: true },
        order: { createdAt: 'DESC' },
        });
        return entities.map(ClientMapper.toDomain);
    }

    async findAllPaginated(options: FindAllPaginatedOptions): Promise<PaginatedClients> {
        const { page, limit, search, sortBy = 'createdAt', sortOrder = 'DESC' } = options;


        // Only active clients
        const queryBuilder = this.ormRepository
        .createQueryBuilder('client')
        .where('client.is_active = :isActive', { isActive: true });

        // Search across multiple fields
        //  Si el usuario escribió algo en el buscador
        if (search && search.trim()) {
        const searchTerm = `%${search.trim().toLowerCase()}%`;
            queryBuilder.andWhere(
                `(
                LOWER(client.name) LIKE :search
                OR LOWER(client.last_name) LIKE :search
                OR LOWER(client.ci) LIKE :search
                OR LOWER(client.phone_number) LIKE :search
                OR LOWER(client.email) LIKE :search
                )`,
                { search: searchTerm },
            );
        }

        // Map sortBy field names to column names (Ordenamiento)
        const sortFieldMap: Record<string, string> = {
            name: 'client.name',
            lastName: 'client.last_name',
            ci: 'client.ci',
            phoneNumber: 'client.phone_number',
            email: 'client.email',
            createdAt: 'client.created_at',
            updatedAt: 'client.updated_at',
        };

        const sortColumn = sortFieldMap[sortBy] ?? 'client.created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        queryBuilder.orderBy(sortColumn, order);

        // Pagination
        const skip = (page - 1) * limit; // Cuántos n registros saltar para llegar a la página actual
        queryBuilder.skip(skip).take(limit);

        const [entities, totalItems] = await queryBuilder.getManyAndCount();

        return {
            items: entities.map(ClientMapper.toDomain),
            totalItems,
        };
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