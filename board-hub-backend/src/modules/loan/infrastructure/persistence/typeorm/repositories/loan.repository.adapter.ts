import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ILoanRepository } from "src/modules/loan/domain/interfaces/loan.repository.interface";
import { LoanOrmEntity } from "../entities/loan.orm-entity";
import { Loan } from "src/modules/loan/domain/entieties/loan.entity";
import { LoanMapper } from "../mappers/loan.mapper";

@Injectable()
export class LoanRepositoryAdapter implements ILoanRepository {
    constructor(
        @InjectRepository(LoanOrmEntity)
        private readonly ormRepository: Repository<LoanOrmEntity>,
    ) { }

    async create(loan: Loan): Promise<Loan> {
        const ormEntity = LoanMapper.toOrm(loan);
        const saved = await this.ormRepository.save(ormEntity);
        return LoanMapper.toDomain(saved);
    }

    async findAll(): Promise<Loan[]> {
        const entities = await this.ormRepository.find({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
        });
        return entities.map(LoanMapper.toDomain);
    }

    async findById(id: string): Promise<Loan | null> {
        const entity = await this.ormRepository.findOne({
            where: { id, isDeleted: false },
        });

        if (!entity) return null;

        return LoanMapper.toDomain(entity);
    }

    async findByGameId(gameId: string): Promise<Loan[]> {
        const entities = await this.ormRepository.find({
            where: { gameId, isDeleted: false },
            order: { createdAt: 'DESC' },
        });
        return entities.map(LoanMapper.toDomain);
    }
    
    async findByClientId(clientId: string): Promise<Loan[]> {
        const entities = await this.ormRepository.find({
            where: { clientId, isDeleted: false },
            order: { createdAt: 'DESC' },
        });
        return entities.map(LoanMapper.toDomain);
    }

    async update(id: string, partial: Partial<Loan>): Promise<Loan> {
        await this.ormRepository.update(id, {
            ...partial,
            updatedAt: new Date(),
        } as any);

        const updated = await this.ormRepository.findOneBy({ id });

        if (!updated) {
            throw new Error(`Loan with id "${id}" not found after update`);
        }

        return LoanMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.update(id, {
            isDeleted: true,
            deletedAt: new Date(),
        } as any);
    }
}