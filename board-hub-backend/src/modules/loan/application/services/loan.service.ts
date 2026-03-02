import { Injectable } from '@nestjs/common';
import { GetAllLoansUseCase } from '../use-cases/get-all-loans.use-case';
import { GetLoanByIdUseCase } from '../use-cases/get-loan-by-id.use-case';
import { DeleteLoanUseCase } from '../use-cases/delete-laon.use-case';
import { CreateLoanCommand, CreateLoantUseCase } from '../use-cases/create-loan.use-case';
import { UpdateLoanCommand, UpdateLoanUseCase } from '../use-cases/update-loan.use-case';
import { Loan } from '../../domain/entities/loan.entity';
import { ReturnLoanUseCase } from '../use-cases/return-loan.use-case';
import { CheckOverdueLoansUseCase } from '../use-cases/check-overdue-loans.use-case';
import { FindAllLoansOptions } from '../../domain/interfaces/loan.repository.interface';


@Injectable()
export class LoanService {

  constructor(
    private readonly createLoanUseCase: CreateLoantUseCase,
    private readonly updateLoanUseCase: UpdateLoanUseCase,
    private readonly getAllLoansUseCase: GetAllLoansUseCase,
    private readonly getLoanByIdUseCase: GetLoanByIdUseCase,
    private readonly deleteLoanUseCase: DeleteLoanUseCase,
    private readonly returnLoanUseCase: ReturnLoanUseCase,
    private readonly checkOverdueUseCase: CheckOverdueLoansUseCase,
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

  async returnLoan(id: string): Promise<Loan>{
    return this.returnLoanUseCase.execute({ id });
  }

  async checkOverdue(): Promise<number>{
    return this.checkOverdueUseCase.execute();
  }
}
