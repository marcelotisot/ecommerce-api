import { 
  IsNotEmpty, 
  IsString, 
  MinLength 
} from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  name: string;
}
