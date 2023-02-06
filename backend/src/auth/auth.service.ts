import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { BcryptService } from '../shared/bcrypt.service';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, enteredPassword: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new ConflictException('Пользователь с таким именем не найден');
    }
    const same = await this.bcryptService.compare(enteredPassword, user.password);
    if (!same) {
      throw new ConflictException('Неправильный пароль');
    }
    const { password, ...result } = user;

    return result;

  }
}
