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
import { Role } from 'src/common/enums/role.enum';
import { UserState } from 'src/common/enums/user-state.enum';


@InputType()
export class CreateUserInput {

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

}
