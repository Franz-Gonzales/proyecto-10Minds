import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

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
  @IsInt()
  @Min(1)
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
