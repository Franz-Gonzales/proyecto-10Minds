import { Loan } from "../entities/loan.entity";
import { LoanStatus } from "../enums/loan-status.enum";

export const LOAN_REPOSITORY = Symbol('LOAN_REPOSITORY');

export interface FindAllLoansOptions {
    status?: LoanStatus;
    clientId?: string;
    gameId?: string;
    includeDeleted?: boolean;
}

export interface ILoanRepository {
    create(loan: Loan): Promise<Loan>;
    findAll(options?: FindAllLoansOptions): Promise<Loan[]>;
    findById(id: string): Promise<Loan | null>;
    findByGameId(gameId: string): Promise<Loan[]>;
    findByClientId(clientId: string): Promise<Loan[]>;
    update(id: string, partial: Partial<Loan>): Promise<Loan>;
    delete(id: string): Promise<void>;

    findOverdue(): Promise<Loan[]>;

    // To update DELAYED in batch
    updateMany(loans: Loan[]): Promise<void>;

    // Count methods for client stats
    countActiveByClientId(clientId: string): Promise<number>;
    countHistoricByClientId(clientId: string): Promise<number>;
}