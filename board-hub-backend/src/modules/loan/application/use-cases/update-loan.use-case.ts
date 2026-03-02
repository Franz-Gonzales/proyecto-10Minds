import { Inject, Injectable } from "@nestjs/common";

import { LOAN_REPOSITORY } from "../../domain/interfaces/loan.repository.interface";
import type { ILoanRepository } from "../../domain/interfaces/loan.repository.interface";
import { GAME_REPOSITORY } from "../../../game/domain/interfaces/game.repository.interface";
import type { IGameRepository } from "../../../game/domain/interfaces/game.repository.interface";
import { CLIENT_REPOSITORY } from "../../../client/domain/interfaces/client.repository.interface";
import type { IClientRepository } from "../../../client/domain/interfaces/client.repository.interface";
import { Loan } from "../../domain/entities/loan.entity";
import { LoanStatus } from "../../domain/enums/loan-status.enum";
import { LoanNotFoundException, InvalidLoanDataException, LoanInvalidDateRangeException } from "../../domain/exceptions/loan.exceptions";
import { GameNotFoundException } from "../../../game/domain/exceptions/game.exceptions";
import { ClientNotFoundException } from "../../../client/domain/exceptions/client.exceptions";

export interface UpdateLoanCommand {
    gameId?: string;
    clientId?: string;
    quantity?: number;
    startDate?: Date;
    endDate?: Date;
    notes?: string | null;
}

@Injectable()
export class UpdateLoanUseCase {
    constructor(
        @Inject(LOAN_REPOSITORY)
        private readonly loanRepository: ILoanRepository,

        @Inject(GAME_REPOSITORY)
        private readonly gameRepository: IGameRepository,

        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(id: string, command: UpdateLoanCommand): Promise<Loan> {
        const loan = await this.loanRepository.findById(id);

        if (!loan || loan.isDeleted) {
            throw new LoanNotFoundException(id);
        }

        // Only RESERVED loans can be edited
        if (loan.status !== LoanStatus.RESERVED) {
            throw new InvalidLoanDataException(
                `Only loans with status RESERVED can be updated. Current status: ${loan.status}`,
            );
        }

        // Validate game exists if changing gameId
        if (command.gameId && command.gameId !== loan.gameId) {
            const game = await this.gameRepository.findById(command.gameId);
            if (!game) {
                throw new GameNotFoundException(command.gameId);
            }
        }

        // Validate client exists if changing clientId
        if (command.clientId && command.clientId !== loan.clientId) {
            const client = await this.clientRepository.findById(command.clientId);
            if (!client) {
                throw new ClientNotFoundException(command.clientId);
            }
        }

        // Validate date range
        const startDate = command.startDate ? new Date(command.startDate) : loan.startDate;
        const endDate = command.endDate ? new Date(command.endDate) : loan.endDate;

        if (startDate >= endDate) {
            throw new LoanInvalidDateRangeException();
        }

        // Handle quantity change — adjust stock
        const targetGameId = command.gameId ?? loan.gameId;
        const newQuantity = command.quantity ?? loan.quantity;

        if (newQuantity !== loan.quantity || targetGameId !== loan.gameId) {
            // Restore stock of old game
            const oldGame = await this.gameRepository.findById(loan.gameId);
            if (oldGame) {
                oldGame.increaseStock(loan.quantity);
                await this.gameRepository.update(oldGame.id, oldGame);
            }

            // Decrease stock of new/same game
            const newGame = await this.gameRepository.findById(targetGameId);
            if (!newGame) {
                throw new GameNotFoundException(targetGameId);
            }
            if (!newGame.hasStock(newQuantity)) {
                throw new InvalidLoanDataException(
                    `Insufficient stock. Available: ${newGame.stockAvailable}, requested: ${newQuantity}`,
                );
            }
            newGame.decreaseStock(newQuantity);
            await this.gameRepository.update(newGame.id, newGame);
        }

        // Recalculate total price
        const game = await this.gameRepository.findById(targetGameId);
        const totalPrice = Loan.calculateTotalPrice(
            startDate,
            endDate,
            newQuantity,
            game!.pricePerDay,
        );

        const updateData: Partial<Loan> = {
            ...command,
            startDate,
            endDate,
            quantity: newQuantity,
            pricePerDay: game!.pricePerDay,
            totalPrice,
        };

        return this.loanRepository.update(id, updateData);
    }
}