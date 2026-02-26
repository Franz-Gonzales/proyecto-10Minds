import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/interfaces/client.repository.interface';
import type { IClientRepository } from '../../domain/interfaces/client.repository.interface';
import { Client } from '../../domain/entieties/client.entity';


@Injectable()
export class GetAllClientUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) { }

    async execute(): Promise<Client[]> {
        return this.clientRepository.findAll();
    }
}