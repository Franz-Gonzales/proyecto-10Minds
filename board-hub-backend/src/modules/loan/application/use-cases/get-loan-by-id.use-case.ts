import { Inject, Injectable } from '@nestjs/common';

import type { ILoanRepository } from '../../domain/interfaces/loan.repository.interface';
import { LOAN_REPOSITORY } from '../../domain/interfaces/loan.repository.interface';
import { Loan } from '../../domain/entities/loan.entity';
import { LoanNotFoundException } from '../../domain/exceptions/loan.exceptions';
import { CheckOverdueLoansUseCase } from './check-overdue-loans.use-case';

@Injectable()
export class GetLoanByIdUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
        private readonly checkOverdueLoansUseCase: CheckOverdueLoansUseCase,
    ) { }

    async execute(id: string): Promise<Loan> {

        // Sincronizar estados vencidos antes de retornar
        await this.checkOverdueLoansUseCase.execute();

        const loan = await this.loanRepository.findById(id);

        if (!loan || loan.isDeleted) {
            throw new LoanNotFoundException(id);
        }

        return loan;
    }
}