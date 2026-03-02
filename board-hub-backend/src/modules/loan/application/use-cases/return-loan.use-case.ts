import { Inject, Injectable } from "@nestjs/common";

import { type ILoanRepository, LOAN_REPOSITORY } from "../../domain/interfaces/loan.repository.interface";
import { LoanAlreadyReturnedException, LoanCannotBeReturnedException, LoanNotFoundException } from "../../domain/exceptions/loan.exceptions";
import { LoanStatus } from "../../domain/enums/loan-status.enum";
import { GAME_REPOSITORY, type IGameRepository } from '../../../game/domain/interfaces/game.repository.interface';
import { GameDeletedException, GameNotFoundException } from '../../../game/domain/exceptions/game.exceptions';
import { Loan } from "../../domain/entities/loan.entity";

export interface ReturnLoanCommand {
    id: string;
}

@Injectable()
export class ReturnLoanUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,

        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
    ) { }

    async execute(command: ReturnLoanCommand): Promise<Loan> {
        // Find the loan by ID
        const loan = await this.loanRepository.findById(command.id);

        if (!loan || loan.isDeleted) {
            throw new LoanNotFoundException(command.id);
        }

        // 2. Validar que se puede devolver
        if (loan.status === LoanStatus.DELIVERED) {
            throw new LoanAlreadyReturnedException(command.id);
        }

        if (!loan.canBeReturned()) {
            throw new LoanCannotBeReturnedException(loan.status);
        }

        const game = await this.gameRepository.findById(loan.gameId);
        if (!game) {
            throw new GameNotFoundException(loan.gameId);
        }
        if (game.isDeleted) {
            throw new GameDeletedException(loan.gameId);
        }

        // Mark the loan as returned and update the game stock
        loan.markAsReturned();

        game.increaseStock(loan.quantity);

        await this.gameRepository.update(game.id, game);

        return this.loanRepository.update(loan.id, loan);
    }
}