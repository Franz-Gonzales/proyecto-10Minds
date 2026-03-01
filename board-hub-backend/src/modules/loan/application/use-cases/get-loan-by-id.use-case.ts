import { Inject, Injectable } from '@nestjs/common';

import type { ILoanRepository } from '../../domain/interfaces/loan.repository.interface';
import { LOAN_REPOSITORY } from '../../domain/interfaces/loan.repository.interface';
import { Loan } from '../../domain/entities/loan.entity';
import { LoanNotFoundException } from '../../domain/exceptions/loan.exceptions';

@Injectable()
export class GetLoanByIdUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(id: string): Promise<Loan> {
        const loan = await this.loanRepository.findById(id);

        if (!loan) {
            throw new LoanNotFoundException(id);
        }

        return loan;
    }
}