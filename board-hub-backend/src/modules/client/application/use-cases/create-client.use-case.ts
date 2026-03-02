import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

import { CLIENT_REPOSITORY } from "../../domain/interfaces/client.repository.interface";
import type { IClientRepository } from "../../domain/interfaces/client.repository.interface";
import { Client } from "../../domain/entieties/client.entity";
import { ClientAlreadyExistsException } from "../../domain/exceptions/client.exceptions";

export interface CreateClientCommand {
    name: string;
    lastName: string;
    ci: string;
    phoneNumber: string;
    email: string;
    direction?: string | null;
}

@Injectable()
export class CreateClientUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(command: CreateClientCommand): Promise<Client> {

        // 1. Validate phone number uniqueness
        const existingByPhone = await this.clientRepository.findByPhoneNumber(command.phoneNumber);
        if (existingByPhone) {
            throw new ClientAlreadyExistsException(command.phoneNumber);
        }

        // 2. Validate email uniqueness
        const existingByEmail = await this.clientRepository.findByEmail(command.email);
        if (existingByEmail) {
            throw new ClientAlreadyExistsException(command.email);
        }

        // 3. Validate CI uniqueness
        const existingByCI = await this.clientRepository.findByCI(command.ci);
        if (existingByCI) {
            throw new ClientAlreadyExistsException(command.ci);
        }

        const client = new Client({
            id: uuidv4(),
            name: command.name,
            lastName: command.lastName,
            ci: command.ci,
            phoneNumber: command.phoneNumber,
            email: command.email,
            direction: command.direction ?? null,
        });

        return this.clientRepository.create(client);
    }
}