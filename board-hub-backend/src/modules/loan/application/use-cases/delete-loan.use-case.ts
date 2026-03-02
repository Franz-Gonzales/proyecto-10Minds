import { Inject, Injectable } from '@nestjs/common';

import { LOAN_REPOSITORY, type ILoanRepository } from "../../domain/interfaces/loan.repository.interface";
import { LoanNotFoundException } from '../../domain/exceptions/loan.exceptions';

@Injectable()
export class DeleteLoanUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(id: string): Promise<boolean> {

        const loan = await this.loanRepository.findById(id)

        if(!loan || loan.isDeleted){
            throw new LoanNotFoundException(id);
        }
        
        await this.loanRepository.delete(id);
        return true;
    }
}