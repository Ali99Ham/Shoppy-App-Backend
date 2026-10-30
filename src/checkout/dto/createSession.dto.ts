import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateCheckoutSessionDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  productIds: number[];
}
