import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { GameCategory } from '../../../domain/enums/game-category.enum';

@InputType()
export class CreateGameInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field(() => GameCategory)
    @IsEnum(GameCategory)
    category: GameCategory;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
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