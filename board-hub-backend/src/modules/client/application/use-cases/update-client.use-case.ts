import { Inject, Injectable } from "@nestjs/common";

import { CLIENT_REPOSITORY } from "../../domain/interfaces/client.repository.interface";
import type { IClientRepository } from "../../domain/interfaces/client.repository.interface";
import { Client } from "../../domain/entieties/client.entity";
import {
    ClientAlreadyExistsException,
    ClientNotFoundException,
    InvalidClientDataException,
} from "../../domain/exceptions/client.exceptions";

export interface UpdateClientCommand {
    name?: string;
    lastName?: string;
    ci?: string;
    phoneNumber?: string;
    email?: string;
    direction?: string | null;
}

@Injectable()
export class UpdateClientUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(id: string, command: UpdateClientCommand): Promise<Client> {

        const existingClient = await this.clientRepository.findById(id);
        if (!existingClient) {
            throw new ClientNotFoundException(id);
        }

        if (command.phoneNumber === '' || command.email === '' || command.ci === '') {
            throw new InvalidClientDataException(
                'Fields phoneNumber, email and ci cannot be empty',
            );
        }

        // 1. Validate phone number uniqueness
        if (command.phoneNumber && command.phoneNumber !== existingClient.phoneNumber) {
            const duplicatePhone = await this.clientRepository.findByPhoneNumber(command.phoneNumber);
            if (duplicatePhone) {
                throw new ClientAlreadyExistsException(command.phoneNumber);
            }
        }

        // 2. Validate email uniqueness
        if (command.email && command.email !== existingClient.email) {
            const duplicateEmail = await this.clientRepository.findByEmail(command.email);
            if (duplicateEmail) {
                throw new ClientAlreadyExistsException(command.email);
            }
        }

        // 3. Validate CI uniqueness
        if (command.ci && command.ci !== existingClient.ci) {
            const duplicateCI = await this.clientRepository.findByCI(command.ci);
            if (duplicateCI) {
                throw new ClientAlreadyExistsException(command.ci);
            }
        }

        return this.clientRepository.update(id, command);
    }
}