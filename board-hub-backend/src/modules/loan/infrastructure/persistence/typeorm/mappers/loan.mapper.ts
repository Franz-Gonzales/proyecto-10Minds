import { Loan } from "../../../../domain/entities/loan.entity";
import { LoanOrmEntity } from "../entities/loan.orm-entity";
import { GameMapper } from "../../../../../game/infrastructure/persistence/typeorm/mappers/game.mapper";
import { ClientMapper } from "../../../../../client/infrastructure/persistence/typeorm/mappers/client.mapper";

export class LoanMapper {

    static toDomain(ormEntity: LoanOrmEntity): Loan {
        const loan = new Loan({
            id: ormEntity.id,
            gameId: ormEntity.gameId,
            clientId: ormEntity.clientId,
            quantity: ormEntity.quantity,
            startDate: ormEntity.startDate,
            endDate: ormEntity.endDate,
            deliveryDate: ormEntity.deliveryDate,
            status: ormEntity.status,
            pricePerDay: ormEntity.pricePerDay != null ? Number(ormEntity.pricePerDay) : 0,
            totalPrice: ormEntity.totalPrice != null ? Number(ormEntity.totalPrice) : 0,
            notes: ormEntity.notes,
            isDeleted: ormEntity.isDeleted,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            deletedAt: ormEntity.deletedAt,
            game: ormEntity.game ? GameMapper.toDomain(ormEntity.game) : undefined,
            client: ormEntity.client ? ClientMapper.toDomain(ormEntity.client) : undefined,
        });

        return loan;
    }

    static toOrm(domain: Loan): LoanOrmEntity {
        const ormEntity = new LoanOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.gameId = domain.gameId;
        ormEntity.clientId = domain.clientId;
        ormEntity.quantity = domain.quantity;
        ormEntity.startDate = domain.startDate;
        ormEntity.endDate = domain.endDate;
        ormEntity.deliveryDate = domain.deliveryDate;
        ormEntity.status = domain.status;
        ormEntity.pricePerDay = domain.pricePerDay;
        ormEntity.totalPrice = domain.totalPrice;
        ormEntity.notes = domain.notes;
        ormEntity.isDeleted = domain.isDeleted;
        return ormEntity;
    }

    static toOrmPartial(partial: Partial<Loan>): Partial<LoanOrmEntity> {
        const ormPartial: Partial<LoanOrmEntity> = {};
        if (partial.gameId !== undefined) ormPartial.gameId = partial.gameId;
        if (partial.clientId !== undefined) ormPartial.clientId = partial.clientId;
        if (partial.quantity !== undefined) ormPartial.quantity = partial.quantity;
        if (partial.startDate !== undefined) ormPartial.startDate = partial.startDate;
        if (partial.endDate !== undefined) ormPartial.endDate = partial.endDate;
        if (partial.deliveryDate !== undefined) ormPartial.deliveryDate = partial.deliveryDate;
        if (partial.status !== undefined) ormPartial.status = partial.status;
        if (partial.pricePerDay !== undefined) ormPartial.pricePerDay = partial.pricePerDay;
        if (partial.totalPrice !== undefined) ormPartial.totalPrice = partial.totalPrice;
        if (partial.notes !== undefined) ormPartial.notes = partial.notes;
        if (partial.isDeleted !== undefined) ormPartial.isDeleted = partial.isDeleted;
        if (partial.deletedAt !== undefined) ormPartial.deletedAt = partial.deletedAt;
        return ormPartial;
    }
}