import { 
  IsArray, 
  IsIn, 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  IsUUID 
} from "class-validator";

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

}
