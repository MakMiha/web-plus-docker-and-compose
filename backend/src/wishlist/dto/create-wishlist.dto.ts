import { IsNotEmpty, IsUrl, IsArray } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: [number];
}
