import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { ClientService } from '../../../application/services/client.service';
import { CreateClientInput } from '../inputs/create-client.input';
import { UpdateClientInput } from '../inputs/update-client.input';
import { ClientType } from '../types/client.type';


@Resolver(() => ClientType)
export class ClientResolver {
  constructor(
    private readonly clientService: ClientService
  ) { }

  @Mutation(() => ClientType, { name: 'createClient' })
  async createClient(@Args('createClientInput') createClientInput: CreateClientInput): Promise<ClientType> {
    return this.clientService.create(createClientInput);
  }

  @Query(() => [ClientType], { name: 'clients' })
  async findAll(): Promise<ClientType[]> {
    return this.clientService.findAll();
  }

  @Query(() => ClientType, { name: 'client' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<ClientType> {
    return this.clientService.findOne(id);
  }

  @Mutation(() => ClientType, { name: 'updateClient' })
  async updateClient(@Args('updateClientInput') updateClientInput: UpdateClientInput): Promise<ClientType> {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Boolean, { name: 'removeClient' })
  async removeClient(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.clientService.remove(id);
  }
}
