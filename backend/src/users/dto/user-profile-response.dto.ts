import { Length, IsEmail, IsUrl } from 'class-validator';

export class UserProfileResponseDto {
  id: number;

  @Length(2, 30)
  username: string;

  @Length(2, 200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}
