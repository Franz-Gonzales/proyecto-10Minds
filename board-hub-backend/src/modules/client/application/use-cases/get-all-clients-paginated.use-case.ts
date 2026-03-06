import { Inject, Injectable } from '@nestjs/common';

import { CLIENT_REPOSITORY } from '../../domain/interfaces/client.repository.interface';
import type { IClientRepository } from '../../domain/interfaces/client.repository.interface';
import { Client } from '../../domain/entities/client.entity';
import { PaginatedResult, buildPaginatedResult } from '../../../../common/dto/paginated-result';


export interface GetAllClientsPaginatedQuery {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class GetAllClientsPaginatedUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: IClientRepository,
    ) {}

    async execute(query: GetAllClientsPaginatedQuery): Promise<PaginatedResult<Client>> {
        const { page, limit, search, sortBy, sortOrder } = query;

        const { items, totalItems } = await this.clientRepository.findAllPaginated({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
        });

        return buildPaginatedResult(items, totalItems, page, limit);
    }

}