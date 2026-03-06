import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { ClientService } from '../../../application/services/client.service';
import { CreateClientInput } from '../inputs/create-client.input';
import { UpdateClientInput } from '../inputs/update-client.input';
import { ClientType } from '../types/client.type';
import { PaginatedClientsType } from '../types/paginated-clients.type';
import { PaginationArgs } from '../../../../../common/dto/pagination.args';
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

  @Query(() => [ClientType], { name: 'clients', description: 'Get all clients (no pagination)' })
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => PaginatedClientsType, {
    name: 'clientsPaginated',
    description: 'Get clients with pagination, search, and sorting',
  })
  async findAllPaginated(
    @Args() paginationArgs: PaginationArgs,
  ): Promise<PaginatedClientsType> {
    const result = await this.clientService.findAllPaginated({
      page: paginationArgs.page,
      limit: paginationArgs.limit,
      search: paginationArgs.search,
      sortBy: paginationArgs.sortBy,
      sortOrder: paginationArgs.sortOrder as 'ASC' | 'DESC',
    });

    return {
      items: result.items as any,
      pageInfo: {
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        itemsPerPage: result.itemsPerPage,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      },
    };
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
