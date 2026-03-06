import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PageInfo')
export class PageInfoType {
    @Field(() => Int, { description: 'Total number of items' })
    totalItems: number;

    @Field(() => Int, { description: 'Total number of pages' })
    totalPages: number;

    @Field(() => Int, { description: 'Current page number (1-based)' })
    currentPage: number;

    @Field(() => Int, { description: 'Items per page' })
    itemsPerPage: number;

    @Field(() => Boolean, { description: 'Whether there is a next page' })
    hasNextPage: boolean;

    @Field(() => Boolean, { description: 'Whether there is a previous page' })
    hasPreviousPage: boolean;
}