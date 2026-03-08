import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min, Max, IsString, IsIn } from 'class-validator';

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { defaultValue: 1, description: 'Page number (1-based)' })
    @IsOptional()
    @IsPositive()
    @Min(1)
    page: number = 1;

    @Field(() => Int, { defaultValue: 10, description: 'Items per page' })
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @Field(() => String, { nullable: true, description: 'Search term' })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => String, { defaultValue: 'createdAt', description: 'Sort field' })
    @IsOptional()
    @IsString()
    sortBy: string = 'createdAt';

    @Field(() => String, { defaultValue: 'DESC', description: 'Sort direction: ASC or DESC' })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC' = 'DESC';
}
