import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';

import { LoanStatus } from '../../../domain/enums/loan-status.enum';
import { GameType } from '../../../../game/presentation/graphql/types/game.type';
import { ClientType } from '../../../../client/presentation/graphql/types/client.type';

@ObjectType('Loan')
export class LoanType {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    gameId: string;

    @Field(() => ID)
    clientId: string;

    @Field(() => Int)
    quantity: number;

    @Field(() => Date)
    startDate: Date;

    @Field(() => Date)
    endDate: Date;

    @Field(() => Date, { nullable: true })
    deliveryDate: Date | null;

    @Field(() => LoanStatus)
    status: LoanStatus;

    @Field(() => Float)
    pricePerDay: number;

    @Field(() => Float)
    totalPrice: number;

    @Field(() => String, { nullable: true })
    notes: string | null;

    @Field(() => Boolean)
    isDeleted: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Date, { nullable: true })
    deletedAt: Date | null;

    // Relations (for nested GraphQL queries)
    @Field(() => GameType, { nullable: true })
    game?: GameType;

    @Field(() => ClientType, { nullable: true })
    client?: ClientType;
}
