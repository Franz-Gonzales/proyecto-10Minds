import { Loan } from "../entities/loan.entity";

export const LOAN_REPOSITORY = Symbol('LOAN_REPOSITORY');

export interface ILoanRepository {
    create(loan: Loan): Promise<Loan>;
    findAll(): Promise<Loan[]>;
    findById(id: string): Promise<Loan | null>;
    findByGameId(gameId: string): Promise<Loan[]>;
    findByClientId(clientId: string): Promise<Loan[]>;
    update(id: string, partial: Partial<Loan>): Promise<Loan>;
    delete(id: string): Promise<void>;
}