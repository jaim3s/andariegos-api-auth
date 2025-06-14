import {
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  IsIn,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    username: string;

    @IsString()
    @MaxLength(100)
    @MinLength(5)
    password: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsIn(Object.values(Role), { each: true })
    roles: Role[];
}
