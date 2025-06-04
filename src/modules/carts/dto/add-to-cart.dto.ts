import { 
  IsNotEmpty, 
  IsNumber, 
  IsUUID, 
  Min 
} from "class-validator";

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Min(1)
  @IsNumber()
  quantity: number;
}
