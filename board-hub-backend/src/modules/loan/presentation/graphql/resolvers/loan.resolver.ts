import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { LoanService } from '../../../application/services/loan.service';
import { CreateLoanInput } from '../inputs/create-loan.input';
import { UpdateLoanInput } from '../inputs/update-loan.input';
import { LoanType } from '../types/loan.type';


@Resolver(() => LoanType)
export class LoanResolver {
  constructor(private readonly loanService: LoanService) {}

  @Mutation(() => LoanType, { name: 'createLoan' })
  async createLoan(@Args('createLoanInput') createLoanInput: CreateLoanInput): Promise<LoanType> {
    return this.loanService.create(createLoanInput);
  }

  @Query(() => [LoanType], { name: 'loan' })
  async findAll(): Promise<LoanType[]> {
    return this.loanService.findAll();
  }

  @Query(() => LoanType, { name: 'loan' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<LoanType> {
    return this.loanService.findOne(id);
  }

  @Mutation(() => LoanType,  { name: 'updateLoan' })
  async updateLoan(@Args('updateLoanInput') updateLoanInput: UpdateLoanInput): Promise<LoanType> {
    return this.loanService.update(updateLoanInput.id, updateLoanInput);
  }

  @Mutation(() => LoanType)
  async removeLoan(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.loanService.remove(id);
  }

  @Mutation(() => LoanType, { name: 'returnLoan' })
  async returnLoan(@Args('id', { type: () => ID }) id: string): Promise<LoanType> {
    return this.loanService.returnLoan(id);
  }

  @Mutation(() => Int, { name: 'checkOverdueLoans' })
  async checkOverdueLoans(): Promise<number> {
    return this.loanService.checkOverdue();
  }
}
