import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateClientInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field(() => String)
  @IsString()  
  @IsNotEmpty()
  ci: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  direction?: string;
}
