import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;
}
