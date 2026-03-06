import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min, Max, IsString } from 'class-validator';


// page = 1        → Qué página quiero (base 1)
// limit = 10      → Cuántos items por página
// search           → Texto libre para buscar
// sortBy           → Por qué campo ordenar (name, email, createdAt...)
// sortOrder        → ASC o DESC
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
    @IsString()
    sortOrder: string = 'DESC';
}
