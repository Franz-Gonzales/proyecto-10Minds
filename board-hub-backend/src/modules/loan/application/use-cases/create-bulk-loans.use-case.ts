import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Loan } from '../../domain/entities/loan.entity';
import { LoanStatus } from '../../domain/enums/loan-status.enum';
import { LOAN_REPOSITORY, type ILoanRepository } from '../../domain/interfaces/loan.repository.interface';
import { GAME_REPOSITORY } from '../../../game/domain/interfaces/game.repository.interface';
import type { IGameRepository } from '../../../game/domain/interfaces/game.repository.interface';
import { CLIENT_REPOSITORY } from '../../../client/domain/interfaces/client.repository.interface';
import type { IClientRepository } from '../../../client/domain/interfaces/client.repository.interface';
import type { Game } from '../../../game/domain/entities/game.entity';
import {
    LoanInsufficientStockException,
    LoanInvalidDateRangeException,
} from '../../domain/exceptions/loan.exceptions';
import { GameDeletedException, GameNotFoundException } from '../../../game/domain/exceptions/game.exceptions';
import { ClientInactiveException, ClientNotFoundException } from '../../../client/domain/exceptions/client.exceptions';

export interface BulkLoanItem {
    gameId: string;
    quantity: number;
}

export interface CreateBulkLoansCommand {
    clientId: string;
    items: BulkLoanItem[];
    startDate: Date;
    endDate: Date;
    notes?: string | null;
}

@Injectable()
export class CreateBulkLoansUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,

        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,

        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(command: CreateBulkLoansCommand): Promise<Loan[]> {
        const start = new Date(command.startDate);
        const end = new Date(command.endDate);

        if (start >= end) {
            throw new LoanInvalidDateRangeException();
        }

        // Validate client
        const client = await this.clientRepository.findById(command.clientId);
        if (!client) {
            throw new ClientNotFoundException(command.clientId);
        }
        if (!client.isActive) {
            throw new ClientInactiveException(command.clientId);
        }

        // Aggregate quantities per game (in case same game appears multiple times)
        const quantityByGame = new Map<string, number>();
        for (const item of command.items) {
            const current = quantityByGame.get(item.gameId) ?? 0;
            quantityByGame.set(item.gameId, current + item.quantity);
        }

        // Validate all games and stock upfront
        const gameMap = new Map<string, Game>();
        for (const [gameId, totalQuantity] of quantityByGame) {
            const game = await this.gameRepository.findById(gameId);
            if (!game) {
                throw new GameNotFoundException(gameId);
            }
            if (game.isDeleted) {
                throw new GameDeletedException(gameId);
            }
            if (totalQuantity > game.stockAvailable) {
                throw new LoanInsufficientStockException(game.stockAvailable, totalQuantity);
            }
            gameMap.set(gameId, game);
        }

        // All validations passed — create loans and update stock
        const createdLoans: Loan[] = [];

        for (const item of command.items) {
            const game = gameMap.get(item.gameId)!;
            const totalPrice = Loan.calculateTotalPrice(start, end, item.quantity, game.pricePerDay);

            const loan = new Loan({
                id: uuidv4(),
                gameId: item.gameId,
                clientId: command.clientId,
                quantity: item.quantity,
                startDate: start,
                endDate: end,
                status: LoanStatus.RESERVED,
                pricePerDay: game.pricePerDay,
                totalPrice,
                notes: command.notes ?? null,
            });

            game.decreaseStock(item.quantity);
            await this.gameRepository.update(game.id, game);

            const created = await this.loanRepository.create(loan);
            createdLoans.push(created);
        }

        return createdLoans;
    }
}