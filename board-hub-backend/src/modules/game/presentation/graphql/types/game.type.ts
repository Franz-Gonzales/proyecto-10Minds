import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

import { CategoryType } from '../../../../category/presentation/graphql/types/category.type';

@ObjectType('Game')
export class GameType {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    categoryId: string;

    @Field(() => String)
    title: string;

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

    @Field(() => CategoryType, { nullable: true })
    category?: CategoryType;
}