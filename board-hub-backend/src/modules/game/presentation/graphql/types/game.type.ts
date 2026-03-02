import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

import { GameCategory } from '../../../domain/enums/game-category.enum';

@ObjectType('Game')
export class GameType {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => GameCategory)
    category: GameCategory;

    @Field(() => String, { nullable: true })
    description: string | null;

    @Field(() => Float)
    pricePerDay: number;

    @Field(() => Int)
    minPlayers: number;

    @Field(() => Int)
    maxPlayers: number;

    @Field(() => Int)
    durationMinutes: number;

    @Field(() => Int)
    stockTotal: number;

    @Field(() => Int)
    stockAvailable: number;

    @Field(() => String, { nullable: true })
    imageUrl: string | null;

    @Field(() => Boolean)
    isDeleted: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}