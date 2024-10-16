import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Matches, 
  MinLength 
} from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  readonly password: string;

  @IsOptional()
  readonly isAdmin?: boolean;
}
