import { Loan } from "src/modules/loan/domain/entieties/loan.entity";
import { LoanOrmEntity } from "../entities/loan.orm-entity";

export class LoanMapper {

    static toDomain(ormEntity: LoanOrmEntity): Loan {
        return new Loan({
            id: ormEntity.id,
            gameId: ormEntity.gameId,
            clientId: ormEntity.clientId,
            quantity: ormEntity.quantity,
            startDate: ormEntity.startDate,
            endDate: ormEntity.endDate,
            deliveryDate: ormEntity.deliveryDate,
            status: ormEntity.status,
            pricePerDay: ormEntity.pricePerDay,
            totalPrice: ormEntity.totalPrice,
            notes: ormEntity.notes,
            isDeleted: ormEntity.isDeleted,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            deletedAt: ormEntity.deletedAt,
        });
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

        return ormEntity;
    }
}