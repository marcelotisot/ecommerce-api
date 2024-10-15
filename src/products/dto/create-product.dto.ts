import { 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  IsUUID, 
  MinLength 
} from "class-validator";

export class CreateProductDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly title: string;
  
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price?: number;
  
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly stock?: number;

  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

}
