import { LoanStatus } from "../enums/loan-status.enum";
import type { Game } from "../../../game/domain/entities/game.entity";
import type { Client } from '../../../client/domain/entities/client.entity';

export class Loan {

    readonly id: string;
    readonly gameId: string;
    readonly clientId: string;
    readonly quantity: number;
    readonly startDate: Date;
    readonly endDate: Date;
    public deliveryDate: Date | null;
    public status: LoanStatus;
    readonly pricePerDay: number;
    readonly totalPrice: number;
    readonly notes: string | null;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;

    // Optional relations (loaded when joined)
    readonly game?: Game;
    readonly client?: Client;

    constructor(props: {
        id: string;
        gameId: string;
        clientId: string;
        quantity: number;
        startDate: Date;
        endDate: Date;
        deliveryDate?: Date | null;
        status: LoanStatus;
        pricePerDay: number;
        totalPrice: number;
        notes?: string | null;
        isDeleted?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date | null;
        game?: Game;
        client?: Client;
    }) {
        this.id = props.id;
        this.gameId = props.gameId;
        this.clientId = props.clientId;
        this.quantity = props.quantity;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.deliveryDate = props.deliveryDate ?? null;
        this.status = props.status;
        this.pricePerDay = props.pricePerDay;
        this.totalPrice = props.totalPrice;
        this.notes = props.notes ?? null;
        this.isDeleted = props.isDeleted ?? false;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
        this.deletedAt = props.deletedAt ?? null;
        this.game = props.game;
        this.client = props.client;
    }

    static calculateTotalPrice(
        startDate: Date,
        endDate: Date,
        quantity: number,
        pricePerDay: number,
    ): number {
        // Calculate how many milliseconds are in a day (24 hours)
        const msPerDay = 1000 * 3600 * 24;

        // Calculate the difference in days between dates
        const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay));
        
        // Calculate the final price and format it
        return parseFloat((days * quantity * pricePerDay).toFixed(2));
    }

    canBeReturned(): boolean {
        return this.status === LoanStatus.RESERVED || this.status === LoanStatus.OVERDUE;
    }

    markAsReturned(): void {
        if (!this.canBeReturned()) {
            throw new Error(`Loan with status ${this.status} cannot be marked as returned`);
        }
        this.status = LoanStatus.DELIVERED;
        this.deliveryDate = new Date();
    }

    markAsOverdue(): void {
        if (this.status !== LoanStatus.RESERVED) {
            throw new Error(`Only loans with status RESERVED can be marked as overdue`);
        }
        this.status = LoanStatus.OVERDUE;
    }
}