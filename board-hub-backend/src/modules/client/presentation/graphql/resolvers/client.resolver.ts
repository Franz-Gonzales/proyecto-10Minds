import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { ClientService } from '../../../application/services/client.service';
import { CreateClientInput } from '../inputs/create-client.input';
import { UpdateClientInput } from '../inputs/update-client.input';
import { ClientType } from '../types/client.type';
import { LoanService } from '../../../../loan/application/services/loan.service';
import { Client } from '../../../domain/entities/client.entity';


@Resolver(() => ClientType)
export class ClientResolver {
  constructor(
    private readonly clientService: ClientService,
    private readonly loanService: LoanService,
  ) { }

  @Mutation(() => ClientType, { name: 'createClient' })
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
  ): Promise<Client> {
    return this.clientService.create(createClientInput);
  }

  @Query(() => [ClientType], { name: 'clients' })
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => ClientType, { name: 'client' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Mutation(() => ClientType, { name: 'updateClient' })
  async updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
  ): Promise<Client> {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Boolean, { name: 'removeClient' })
  async removeClient(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.clientService.remove(id);
  }

  @ResolveField('activeLoans', () => Int)
  async activeLoans(@Parent() client: Client): Promise<number> {
    return this.loanService.countActiveByClient(client.id);
  }

  @ResolveField('totalHistoric', () => Int)
  async totalHistoric(@Parent() client: Client): Promise<number> {
    return this.loanService.countHistoricByClient(client.id);
  }
}
