import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { plainToInstance } from 'class-transformer';
import { BcryptService } from '../shared/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try { const hash = await this.bcryptService.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    return await this.userRepository.save(user);
    } catch(error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(
    username: string,
  ): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findMany(user: {
    query: string;
  }): Promise<UserPublicProfileResponseDto[]> {
    const searchUser = await this.userRepository.find({
      where: [{ email: user.query }, { username: user.query }],
    });
    return plainToInstance(UserPublicProfileResponseDto, searchUser);
  }

  async update(
    id: number,
    user: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    if (user.password) {
      const newPassword = await this.bcryptService.hash(user.password);
      await this.userRepository.update(id, {
        ...user,
        password: newPassword,
      });
      return this.findOne(id);
    }

    await this.userRepository.update({ id }, user);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
