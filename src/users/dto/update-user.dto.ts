import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength 
} from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstName?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;
}
