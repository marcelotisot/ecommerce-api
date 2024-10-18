import { IsNotEmpty, IsUUID } from "class-validator";

export class UploadImageDto {

  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
