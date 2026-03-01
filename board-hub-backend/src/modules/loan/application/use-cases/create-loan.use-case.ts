import { Inject, Injectable } from "@nestjs/common";

import { v4 as uuidv4 } from 'uuid';
import { Loan } from "../../domain/entieties/loan.entity";
import { LOAN_REPOSITORY } from "../../domain/interfaces/loan.repository.interface";
import type { ILoanRepository } from "../../domain/interfaces/loan.repository.interface";
import { LoanStatus } from "../../domain/enums/loan-status.enum";

import { GAME_REPOSITORY, type IGameRepository } from "src/modules/game/domain/interfaces/game.repository.interface";
import { CLIENT_REPOSITORY, type IClientRepository } from '../../../client/domain/interfaces/client.repository.interface';
import { LoanInsufficientStockException, LoanInvalidDateRangeException } from "../../domain/exceptions/loan.exceptions";
import { GameDeletedException, GameNotFoundException } from "src/modules/game/domain/exceptions/game.exceptions";
import { ClientInactiveException, ClientNotFoundException } from '../../../client/domain/exceptions/client.exceptions';

export interface CreateLoanCommand {
    gameId: string;
    clientId: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
    notes?: string | null;
}

@Injectable()
export class CreateLoantUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,

        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,
        
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(command: CreateLoanCommand): Promise<Loan> {

        // Validate date range
        const start = new Date(command.startDate);
        const end = new Date(command.endDate);

        if (start > end) {
            throw new LoanInvalidDateRangeException();
        }

        // Validate that the game exists and is not deleted
        const game = await this.gameRepository.findById(command.gameId);
        if (!game) {
            throw new GameNotFoundException(command.gameId);
        }
        if(game.isDeleted) {
            throw new GameDeletedException(command.gameId);
        }

        // Verify that the client exists and is active
        const client = await this.clientRepository.findById(command.clientId);
        if (!client) {
            throw new ClientNotFoundException(command.clientId);
        }
        if(client.isActive === false) {
            throw new ClientInactiveException(command.clientId);
        }

        // Check available stock
        if(command.quantity > game.stockAvailable) {
            throw new LoanInsufficientStockException(game.stockAvailable, command.quantity);
        }
        
        const totalPrice = Loan.calculateTotalPrice(start, end, command.quantity, game.pricePerDay);

        const loan = new Loan({
            id: uuidv4(),
            gameId: command.gameId,
            clientId: command.clientId,
            quantity: command.quantity,
            startDate: start,
            endDate: end,
            status: LoanStatus.RESERVED,
            pricePerDay: game.pricePerDay,
            totalPrice,
            notes: command.notes ?? null,
            isDeleted: false,
        });

        // Update game stock
        game.decreaseStock(command.quantity);
        await this.gameRepository.update(game.id, game);

        return this.loanRepository.create(loan);
    }

}