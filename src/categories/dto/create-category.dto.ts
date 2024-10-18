import { 
  IsNotEmpty, 
  MaxLength, 
  MinLength 
} from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  name: string;
}
