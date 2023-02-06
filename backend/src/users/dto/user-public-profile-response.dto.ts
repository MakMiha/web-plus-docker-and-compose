import { Length, IsUrl } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserPublicProfileResponseDto {
  id: number;

  @Length(2, 30)
  username: string;

  @Length(2, 200)
  about: string;

  @IsUrl()
  avatar: string;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  email: string;
}
