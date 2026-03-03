import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { LoanService } from '../../../application/services/loan.service';
import { CreateLoanInput } from '../inputs/create-loan.input';
import { UpdateLoanInput } from '../inputs/update-loan.input';
import { LoanType } from '../types/loan.type';
import { LoanStatus } from '../../../domain/enums/loan-status.enum';
import { Loan } from '../../../domain/entities/loan.entity';


@Resolver(() => LoanType)
export class LoanResolver {
  constructor(private readonly loanService: LoanService) {}

  @Mutation(() => LoanType, { name: 'createLoan' })
  async createLoan(
    @Args('createLoanInput') createLoanInput: CreateLoanInput,
  ): Promise<Loan> {
    return this.loanService.create(createLoanInput);
  }

  @Query(() => [LoanType], { 
    name: 'loans',
    description: 'Get all loans. Supports filters by status, client, and game.'
  })
  async findAll(
    @Args('status', { type: () => LoanStatus, nullable: true, description: 'Filter by loan status' }) status?: LoanStatus,
    @Args('clientId', { type: () => ID, nullable: true, description: 'Filter by client ID' }) clientId?: string,
    @Args('gameId', { type: () => ID, nullable: true, description: 'Filter by game ID' }) gameId?: string,
    @Args('includeDeleted', { type: () => Boolean, nullable: true, defaultValue: true, description: 'Whether to include deleted loans' }) includeDeleted?: boolean,
  ): Promise<Loan[]> {
    return this.loanService.findAll({
      status,
      clientId,
      gameId,
      includeDeleted,
    });
  }

  @Query(() => LoanType, { name: 'loan' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Loan> {
    return this.loanService.findOne(id);
  }

  @Mutation(() => LoanType, { name: 'updateLoan' })
  async updateLoan(
    @Args('updateLoanInput') updateLoanInput: UpdateLoanInput,
  ): Promise<Loan> {
    const { id, ...data } = updateLoanInput;
    return this.loanService.update(id, data);
  }

  @Mutation(() => Boolean, { name: 'removeLoan' })
  async removeLoan(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.loanService.remove(id);
  }

  @Mutation(() => LoanType, { name: 'returnLoan' })
  async returnLoan(@Args('id', { type: () => ID }) id: string): Promise<Loan> {
    return this.loanService.returnLoan(id);
  }

  @Mutation(() => Int, { name: 'checkOverdueLoans' })
  async checkOverdueLoans(): Promise<number> {
    return this.loanService.checkOverdue();
  }
}
