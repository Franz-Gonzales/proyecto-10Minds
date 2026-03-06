import { Field, ObjectType } from '@nestjs/graphql';
import { ClientType } from './client.type';
import { PageInfoType } from '../../../../../common/dto/page-info.type';

@ObjectType('PaginatedClients')
export class PaginatedClientsType {
    @Field(() => [ClientType], { description: 'List of clients for the current page' })
    items: ClientType[];

    @Field(() => PageInfoType, { description: 'Pagination metadata' })
    pageInfo: PageInfoType;
}