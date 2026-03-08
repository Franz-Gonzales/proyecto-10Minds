import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, LessThan, Repository } from "typeorm";

import { FindAllLoansOptions, ILoanRepository } from "../../../../domain/interfaces/loan.repository.interface";
import { LoanOrmEntity } from "../entities/loan.orm-entity";
import { Loan } from "../../../../domain/entities/loan.entity";
import { LoanMapper } from "../mappers/loan.mapper";
import { LoanStatus } from "../../../../domain/enums/loan-status.enum";

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
            .leftJoinAndSelect('loan.client', 'client');

        if (!options.includeDeleted) {
            qb.andWhere('loan.is_deleted = false');
        }

        if (options.status) {
            qb.andWhere('loan.status = :status', { status: options.status });
        }

        if (options.clientId) {
            qb.andWhere('loan.client_id = :clientId', { clientId: options.clientId });
        }

        if (options.gameId) {
            qb.andWhere('loan.game_id = :gameId', { gameId: options.gameId });
        }

        qb.orderBy('loan.created_at', 'DESC');

        const entities = await qb.getMany();
        return entities.map(LoanMapper.toDomain);
    }

    async findById(id: string): Promise<Loan | null> {
        const entity = await this.ormRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['game', 'client'],
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
        const entity = await this.ormRepository.findOne({
            where: { id },
            relations: ['game', 'client'],
        });

        if (!entity) {
            throw new Error(`Loan with id "${id}" not found in database`);
        }

        const mappedPartial = LoanMapper.toOrmPartial(partial);
        const updatedEntity = this.ormRepository.merge(entity, mappedPartial);
        const saved = await this.ormRepository.save(updatedEntity);
        return LoanMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.update(id, {
            isDeleted: true,
            deletedAt: new Date(),
        });
    }

    async findOverdue(): Promise<Loan[]> {
        const now = new Date();

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
                status: loan.status,
                updatedAt: new Date(),
            }))
        );
    }

    async countActiveByClientId(clientId: string): Promise<number> {
        return this.ormRepository.count({
            where: {
                clientId,
                status: In([LoanStatus.RESERVED, LoanStatus.OVERDUE]),
                isDeleted: false,
            },
        });
    }

    async countHistoricByClientId(clientId: string): Promise<number> {
        return this.ormRepository.count({
            where: {
                clientId,
                isDeleted: false,
            },
        });
    }
}