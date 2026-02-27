import { InputType, Int, Field, ID, Float } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { LoanStatus } from 'src/modules/loan/domain/enums/loan-status.enum';

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

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deliveryDate?: Date | null;

  @Field(() => LoanStatus)
  @IsNotEmpty()
  @IsEnum(LoanStatus)
  status: LoanStatus;

  @Field(() => Float)
  @IsNotEmpty()
  pricePerDay: number;

  @Field(() => Float)
  @IsNotEmpty()
  totalPrice: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
