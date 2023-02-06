import { IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsOptional()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
