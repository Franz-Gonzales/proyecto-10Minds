import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateLoanInput } from './create-loan.input';

@InputType()
export class UpdateLoanInput extends PartialType(CreateLoanInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
