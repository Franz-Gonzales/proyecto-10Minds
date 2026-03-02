import { Inject, Injectable } from '@nestjs/common';

import { FindAllLoansOptions, type ILoanRepository, LOAN_REPOSITORY } from '../../domain/interfaces/loan.repository.interface';
import { Loan } from '../../domain/entities/loan.entity';
import { CheckOverdueLoansUseCase } from './check-overdue-loans.use-case';

@Injectable()
export class GetAllLoansUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
        private readonly checkOverdueLoansUseCase: CheckOverdueLoansUseCase,
    ) { }

    async execute(command: FindAllLoansOptions): Promise<Loan[]> {
        // Detectar y marcar vencidos antes de retornar la lista
        await this.checkOverdueLoansUseCase.execute();

        return this.loanRepository.findAll({
            status: command.status,
            clientId: command.clientId,
            gameId: command.gameId,
            includeDeleted: command.includeDeleted ?? true,
        });
    }
}