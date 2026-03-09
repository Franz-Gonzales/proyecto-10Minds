import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
    IsUUID,
    IsNotEmpty,
    IsInt,
    Min,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class BulkLoanItemInput {
    @Field(() => ID)
    @IsUUID()
    @IsNotEmpty()
    gameId: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    quantity: number;
}

@InputType()
export class CreateBulkLoansInput {
    @Field(() => ID)
    @IsUUID()
    @IsNotEmpty()
    clientId: string;

    @Field(() => [BulkLoanItemInput])
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => BulkLoanItemInput)
    items: BulkLoanItemInput[];

    @Field(() => Date)
    @IsNotEmpty()
    @IsDate()
    startDate: Date;

    @Field(() => Date)
    @IsNotEmpty()
    @IsDate()
    endDate: Date;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;
}