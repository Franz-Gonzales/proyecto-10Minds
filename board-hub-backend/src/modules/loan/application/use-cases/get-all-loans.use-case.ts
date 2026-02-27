import { Inject, Injectable } from '@nestjs/common';
import { type ILoanRepository, LOAN_REPOSITORY } from '../../domain/interfaces/loan.repository.interface';
import { Loan } from '../../domain/entieties/loan.entity';

@Injectable()
export class GetAllLoansUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(): Promise<Loan[]> {
        return this.loanRepository.findAll();
    }
}