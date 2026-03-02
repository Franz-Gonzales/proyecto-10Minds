import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateLoanInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  gameId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @Field(() => Int)
  @IsNotEmpty()
  quantity: number;

  @Field(() => Date)
  @IsNotEmpty()
  startDate: Date;  

  @Field(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
