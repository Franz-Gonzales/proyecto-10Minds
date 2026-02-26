import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import {
    IsNotEmpty,
    IsUUID,
} from 'class-validator';

import { CreateGameInput } from './create-game.input';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
    @Field(() => ID)
    @IsUUID()
    @IsNotEmpty()
    id: string;

}