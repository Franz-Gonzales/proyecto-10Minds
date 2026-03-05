import { InputType, Field, Int, Float, ID } from '@nestjs/graphql';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

@InputType()
export class CreateGameInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field(() => ID)
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => Float)
    @IsNumber()
    @Min(0.01)
    pricePerDay: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    minPlayers: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    maxPlayers: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    durationMinutes: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    stockTotal: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}