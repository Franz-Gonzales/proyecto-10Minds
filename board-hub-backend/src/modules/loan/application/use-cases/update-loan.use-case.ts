import { Inject, Injectable } from "@nestjs/common";
import { LOAN_REPOSITORY } from "../../domain/interfaces/loan.repository.interface";
import type { ILoanRepository } from "../../domain/interfaces/loan.repository.interface";
import { Loan } from "../../domain/entieties/loan.entity";
import { LoanStatus } from "../../domain/enums/loan-status.enum";

export interface UpdateLoanCommand {
    gameId?: string;
    clientId?: string;
    quantity?: number;
    startDate?: Date;
    endDate?: Date;
    deliveryDate?: Date | null;
    status?: LoanStatus;
    pricePerDay?: number;
    totalPrice?: number;
    notes?: string | null;
}

@Injectable()
export class UpdateLoanUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(id: string, command: UpdateLoanCommand): Promise<Loan> {

        throw new Error('Not implemented yet');
    }
}