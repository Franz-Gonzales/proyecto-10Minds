import { Inject, Injectable } from "@nestjs/common";

import { v4 as uuidv4 } from 'uuid';
import { Loan } from "../../domain/entieties/loan.entity";
import { LOAN_REPOSITORY } from "../../domain/interfaces/loan.repository.interface";
import type { ILoanRepository } from "../../domain/interfaces/loan.repository.interface";
import { LoanStatus } from "../../domain/enums/loan-status.enum";

export interface CreateLoanCommand {
    gameId: string;
    clientId: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
    deliveryDate?: Date | null;
    status: LoanStatus;
    pricePerDay: number;
    totalPrice: number;
    notes?: string | null;
}

@Injectable()
export class CreateLoantUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(command: CreateLoanCommand): Promise<Loan> {

        throw new Error('Not implemented yet');
    }
}