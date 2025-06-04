import { 
  IsArray,
  IsEmail, 
  IsIn, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Matches, 
  MaxLength, 
  MinLength 
} from "class-validator";

import { ValidRoles } from "../../../modules/auth/interfaces";

export class CreateUserDto {
  
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @IsArray()
  @IsOptional()
  @IsIn(
    [ValidRoles.admin, ValidRoles.user], // Valores permitidos
    { each: true } // valida que cada rol esté en esta lista
  )
  roles?: ValidRoles[];

}