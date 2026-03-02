import { Inject, Injectable } from '@nestjs/common';

import type {  IClientRepository } from '../../domain/interfaces/client.repository.interface';
import { CLIENT_REPOSITORY } from '../../domain/interfaces/client.repository.interface';
import { Client } from '../../domain/entities/client.entity';
import { ClientNotFoundException } from '../../domain/exceptions/client.exceptions';

@Injectable()
export class GetClientByIdUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(id: string): Promise<Client> {
        const client = await this.clientRepository.findById(id);

        if (!client) {
            throw new ClientNotFoundException(id);
        }

        return client;
    }
}