import { Inject, Injectable } from '@nestjs/common';
import { LOAN_REPOSITORY, type ILoanRepository } from "../../domain/interfaces/loan.repository.interface";

@Injectable()
export class DeleteLoanUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(id: string): Promise<boolean> {
        
        try {
            await this.loanRepository.delete(id);
            return true;
        } catch (error) {
            
            return false;
        }
    }
}