import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductDTO {
  @IsString()
  @IsOptional()
  name: string;

  @Type(() => Number)
  @IsOptional()
  price: number;

  @Type(() => Number)
  @IsOptional()
  userId: number;

  @Type(() => Number)
  @IsOptional()
  page: number;

  @Type(() => Number)
  @IsOptional()
  limit: number;
}
