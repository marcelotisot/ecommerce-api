import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional 
} from "class-validator";

export class UpdateUserDto {

  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

}
