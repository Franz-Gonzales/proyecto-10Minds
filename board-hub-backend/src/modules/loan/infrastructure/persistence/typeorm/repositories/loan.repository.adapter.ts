import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";

import { FindAllLoansOptions, ILoanRepository } from "src/modules/loan/domain/interfaces/loan.repository.interface";
import { LoanOrmEntity } from "../entities/loan.orm-entity";
import { Loan } from "src/modules/loan/domain/entities/loan.entity";
import { LoanMapper } from "../mappers/loan.mapper";
import { LoanStatus } from "src/modules/loan/domain/enums/loan-status.enum";

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

    async findAll(options: FindAllLoansOptions = {}): Promise<Loan[]> {
        const qb = this.ormRepository.createQueryBuilder('loan')
            .leftJoinAndSelect('loan.game', 'game')
            .leftJoinAndSelect('loan.client', 'client')

        if (!options.includeDeleted) {
            qb.andWhere('loan.isDeleted = false');
        }

        if (options.status) {
            qb.andWhere('loan.status = :status', { status: options.status });
        }

        if (options.clientId) {
            qb.andWhere('loan.clientId = :clientId', { clientId: options.clientId });
        }

        if (options.gameId) {
            qb.andWhere('loan.gameId = :gameId', { gameId: options.gameId });
        }

        qb.orderBy('loan.createdAt', 'DESC');

        const entities = await qb.getMany();
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

    async findOverdue(): Promise<Loan[]> {
        const now = new Date();
        // now.setHours(0, 0, 0, 0);

        const entities = await this.ormRepository.find({
            where: {
                status: LoanStatus.RESERVED,
                endDate: LessThan(now),
                isDeleted: false,
            },
            relations: ['game', 'client'],
        });
        return entities.map(LoanMapper.toDomain);
    }

    async updateMany(loans: Loan[]): Promise<void> {
        if (loans.length === 0) return;

        await Promise.all(
            loans.map(loan => this.ormRepository.update(loan.id, {
                status: loan.status
            }))
        )
    }
}