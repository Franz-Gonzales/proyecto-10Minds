import { Inject, Injectable } from '@nestjs/common';

import { type ILoanRepository, LOAN_REPOSITORY } from '../../domain/interfaces/loan.repository.interface';
import { GAME_REPOSITORY, type IGameRepository } from '../../../game/domain/interfaces/game.repository.interface';
import { Loan } from '../../domain/entities/loan.entity';
import { LoanNotFoundException, LoanCannotBeRevertedException } from '../../domain/exceptions/loan.exceptions';
import { GameNotFoundException, GameDeletedException } from '../../../game/domain/exceptions/game.exceptions';
import { LoanInsufficientStockException } from '../../domain/exceptions/loan.exceptions';

export interface RevertLoanCommand {
    id: string;
}

@Injectable()
export class RevertLoanUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,

        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
    ) { }

    async execute(command: RevertLoanCommand): Promise<Loan> {
        const loan = await this.loanRepository.findById(command.id);

        if (!loan || loan.isDeleted) {
            throw new LoanNotFoundException(command.id);
        }

        if (!loan.canBeReverted()) {
            throw new LoanCannotBeRevertedException(loan.status);
        }

        // Validate the game still exists and has enough stock capacity
        const game = await this.gameRepository.findById(loan.gameId);
        if (!game) {
            throw new GameNotFoundException(loan.gameId);
        }
        if (game.isDeleted) {
            throw new GameDeletedException(loan.gameId);
        }

        // When we revert, the game items go back "out" — decrease stock again
        if (!game.hasStock(loan.quantity)) {
            throw new LoanInsufficientStockException(game.stockAvailable, loan.quantity);
        }

        // Revert the loan status (DELIVERED → RESERVED or OVERDUE)
        loan.revertReturn();

        // Decrease stock (items are "out on loan" again)
        game.decreaseStock(loan.quantity);
        await this.gameRepository.update(game.id, game);

        return this.loanRepository.update(loan.id, loan);
    }
}