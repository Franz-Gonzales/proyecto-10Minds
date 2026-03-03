import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType('Client')
export class ClientType {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    lastName: string;

    @Field(() => String)
    ci: string;

    @Field(() => String)
    phoneNumber: string;

    @Field(() => String)
    email: string;

    @Field(() => String, { nullable: true })
    direction: string | null;

    @Field(() => Boolean)
    isActive: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Date, { nullable: true })
    deletedAt: Date | null;

    
    @Field(() => Int, { nullable: true, description: 'Number of active loans (RESERVED + OVERDUE)' })
    activeLoans?: number;

    @Field(() => Int, { nullable: true, description: 'Total historic loans count' })
    totalHistoric?: number;
}
