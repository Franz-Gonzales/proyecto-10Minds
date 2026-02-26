import { Client } from "../../../../domain/entieties/client.entity";
import { ClientOrmEntity } from "../entities/client.orm-entity";

export class ClientMapper {

    static toDomain(ormEntity: ClientOrmEntity): Client {
        return new Client({
            id: ormEntity.id,
            name: ormEntity.name,
            lastName: ormEntity.lastName,
            ci: ormEntity.ci,
            phoneNumber: ormEntity.phoneNumber,
            email: ormEntity.email,
            direction: ormEntity.direction,
            isActive: ormEntity.isActive,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            deletedAt: ormEntity.deletedAt,
        });
    }

    static toOrm(domain: Client): ClientOrmEntity {
        const ormEntity = new ClientOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.name = domain.name;
        ormEntity.lastName = domain.lastName;
        ormEntity.ci = domain.ci;
        ormEntity.phoneNumber = domain.phoneNumber;
        ormEntity.email = domain.email;
        ormEntity.direction = domain.direction;
        ormEntity.isActive = domain.isActive;
        return ormEntity;
    }
}