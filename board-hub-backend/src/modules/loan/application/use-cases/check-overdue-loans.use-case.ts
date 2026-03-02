import { Inject, Injectable } from "@nestjs/common";
import { type ILoanRepository, LOAN_REPOSITORY } from "../../domain/interfaces/loan.repository.interface";


@Injectable()
export class CheckOverdueLoansUseCase {

    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,
    ) { }

    async execute(): Promise<number> {

        /**
        * Detects all RESERVED loans whose end date has passed

        * and marks them as OVERDUE in batch.

        * Called from get-all-loans and get-loan-by-id before returning data.
        */

        const overdueLoas = await this.loanRepository.findOverdue();

        if (overdueLoas.length === 0) return 0;

        overdueLoas.forEach(loan => loan.markAsOverdue());

        await this.loanRepository.updateMany(overdueLoas);

        return overdueLoas.length;
    }
}