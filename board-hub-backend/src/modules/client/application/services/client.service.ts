import { Injectable } from '@nestjs/common';

import { CreateClientCommand, CreateClientUseCase } from '../use-cases/create-client.use-case';
import { GetAllClientUseCase } from '../use-cases/get-all-clients.use-case';
import { UpdateClientCommand, UpdateClientUseCase } from '../use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../use-cases/delete-client.use-case';
import { GetClientByIdUseCase } from '../use-cases/get-client-by-id.use-case';
import { Client } from '../../domain/entieties/client.entity';

@Injectable()
export class ClientService {

  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getAllClientUseCase: GetAllClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly getClientByIdUseCase: GetClientByIdUseCase,

  ) {}
  async create(command: CreateClientCommand): Promise<Client> {
    return this.createClientUseCase.execute(command);
  }

  async findAll(): Promise<Client[]> {
    return this.getAllClientUseCase.execute();
  }

  async findOne(id: string): Promise<Client> {
    return this.getClientByIdUseCase.execute(id);
  }
  

  async update(id: string, command: UpdateClientCommand): Promise<Client> {
    return this.updateClientUseCase.execute(id, command);
  }

  async remove(id: string): Promise<boolean> {
    return this.deleteClientUseCase.execute(id);
  }
}
