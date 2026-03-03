import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType('Category')
export class CategoryType {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    description: string;

    @Field(() => String)
    icon: string;

    @Field(() => Boolean)
    isActive: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Date, { nullable: true })
    deletedAt: Date | null;
}