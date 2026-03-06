import { Client } from "../entities/client.entity";

export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');

export interface FindAllPaginatedOptions {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedClients {
    items: Client[];
    totalItems: number;
}

export interface  IClientRepository {
    create(client: Client): Promise<Client>;
    findAll(): Promise<Client[]>;
    findAllPaginated(options: FindAllPaginatedOptions): Promise<PaginatedClients>;
    findById(id: string): Promise<Client | null>;
    findByPhoneNumber(phoneNumber: string): Promise<Client | null>;
    findByEmail(email: string): Promise<Client | null>;
    findByCI(ci: string): Promise<Client | null>;
    update(id: string, partial: Partial<Client>): Promise<Client>;
    delete(id: string): Promise<void>;
}