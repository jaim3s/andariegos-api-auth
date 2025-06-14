import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  IsIn,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { UserState } from '../enums/user-state.enum';



@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  username: string;

  @Field()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  password: string;

  @Field(() => [Role])
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(Object.values(Role), { each: true })
  roles: Role[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  registrationDate?: Date;

  @Field(() => UserState, { defaultValue: UserState.ACTIVE })
  @IsEnum(UserState)
  state: UserState;
}
