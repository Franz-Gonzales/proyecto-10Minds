import { Inject, Injectable } from '@nestjs/common';
import type { IClientRepository } from '../../domain/interfaces/client.repository.interface';
import { CLIENT_REPOSITORY } from '../../domain/interfaces/client.repository.interface';
import { ClientNotFoundException, InvalidClientDataException } from '../../domain/exceptions/client.exceptions';

@Injectable()
export class DeleteClientUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(id: string): Promise<boolean> {
        const existClient = await this.clientRepository.findById(id);

        if (!existClient) {
            throw new ClientNotFoundException(id);
        }

        try {
            await this.clientRepository.delete(id);
            return true;
        } catch (error) {
            throw new InvalidClientDataException(`Failed to delete client with id "${id}"`);
        }
    }
}