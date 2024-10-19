import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsUUID, 
  Min 
} from "class-validator";

export class CreateCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  readonly productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly quantity: number;
}
