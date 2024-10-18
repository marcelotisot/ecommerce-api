import { 
  IsNotEmpty, 
  IsString, 
  IsUUID,
} from "class-validator";

export class CreateReviewDto {

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

}
