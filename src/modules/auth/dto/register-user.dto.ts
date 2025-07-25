import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  Matches, 
  MaxLength, 
  MinLength 
} from "class-validator";

export class RegisterUserDto {

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

}