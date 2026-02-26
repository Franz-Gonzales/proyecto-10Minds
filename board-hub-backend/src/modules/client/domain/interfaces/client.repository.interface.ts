import { Client } from "../entieties/client.entity";


export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');

export interface  IClientRepository {
    create(client: Client): Promise<Client>;
    findAll(): Promise<Client[]>;
    findById(id: string): Promise<Client | null>;
    findByPhoneNumber(phoneNumber: string): Promise<Client | null>;
    findByEmail(email: string): Promise<Client | null>;
    findByCI(ci: string): Promise<Client | null>;
    update(id: string, partial: Partial<Client>): Promise<Client>;
    delete(id: string): Promise<void>;
}