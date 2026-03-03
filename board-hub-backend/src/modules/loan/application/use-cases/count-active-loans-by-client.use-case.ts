import { Inject, Injectable } from '@nestjs/common';

import { LOAN_REPOSITORY } from '../../domain/interfaces/loan.repository.interface';
import type { ILoanRepository } from '../../domain/interfaces/loan.repository.interface';

@Injectable()
export class CountActiveLoansByClientUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) {}

    async execute(clientId: string): Promise<number> {
        return this.loanRepository.countActiveByClientId(clientId);
    }
}