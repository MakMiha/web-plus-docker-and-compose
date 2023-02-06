import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Length, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  about: string;

  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;
}
