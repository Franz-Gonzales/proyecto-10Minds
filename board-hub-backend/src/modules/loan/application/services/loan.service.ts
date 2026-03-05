import { Injectable } from '@nestjs/common';

import { GetAllLoansUseCase } from '../use-cases/get-all-loans.use-case';
import { GetLoanByIdUseCase } from '../use-cases/get-loan-by-id.use-case';
import { DeleteLoanUseCase } from '../use-cases/delete-loan.use-case';
import { CreateLoanCommand, CreateLoanUseCase } from '../use-cases/create-loan.use-case';
import { UpdateLoanCommand, UpdateLoanUseCase } from '../use-cases/update-loan.use-case';
import { Loan } from '../../domain/entities/loan.entity';
import { ReturnLoanUseCase } from '../use-cases/return-loan.use-case';
import { RevertLoanUseCase } from '../use-cases/revert-loan.use-case';
import { CheckOverdueLoansUseCase } from '../use-cases/check-overdue-loans.use-case';
import { FindAllLoansOptions } from '../../domain/interfaces/loan.repository.interface';
import { CountActiveLoansByClientUseCase } from '../use-cases/count-active-loans-by-client.use-case';
import { CountHistoricLoansByClientUseCase } from '../use-cases/count-historic-loans-by-client.use-case';


@Injectable()
export class LoanService {

  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
    private readonly updateLoanUseCase: UpdateLoanUseCase,
    private readonly getAllLoansUseCase: GetAllLoansUseCase,
    private readonly getLoanByIdUseCase: GetLoanByIdUseCase,
    private readonly deleteLoanUseCase: DeleteLoanUseCase,
    private readonly returnLoanUseCase: ReturnLoanUseCase,
    private readonly revertLoanUseCase: RevertLoanUseCase,
    private readonly checkOverdueUseCase: CheckOverdueLoansUseCase,
    private readonly countActiveLoansByClientUseCase: CountActiveLoansByClientUseCase,
    private readonly countHistoricLoansByClientUseCase: CountHistoricLoansByClientUseCase,
  ) { }

  async create(command: CreateLoanCommand): Promise<Loan> {
    return this.createLoanUseCase.execute(command);
  }

  async findAll(query?: FindAllLoansOptions): Promise<Loan[]> {
    return this.getAllLoansUseCase.execute(query || {});
  }

  async findOne(id: string): Promise<Loan> {
    return this.getLoanByIdUseCase.execute(id);
  }

  async update(id: string, command: UpdateLoanCommand): Promise<Loan> {
    return this.updateLoanUseCase.execute(id, command);
  }

  async remove(id: string): Promise<boolean> {
    return this.deleteLoanUseCase.execute(id);
  }

  async returnLoan(id: string): Promise<Loan> {
    return this.returnLoanUseCase.execute({ id });
  }

  async revertLoan(id: string): Promise<Loan> {
    return this.revertLoanUseCase.execute({ id });
  }

  async checkOverdue(): Promise<number> {
    return this.checkOverdueUseCase.execute();
  }

  async countActiveByClient(clientId: string): Promise<number> {
    return this.countActiveLoansByClientUseCase.execute(clientId);
  }

  async countHistoricByClient(clientId: string): Promise<number> {
    return this.countHistoricLoansByClientUseCase.execute(clientId);
  }
}
