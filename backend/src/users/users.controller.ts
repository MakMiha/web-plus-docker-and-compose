import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseGuards(JwtGuard) 
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  findOne(@Req() req): Promise<UserProfileResponseDto> {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findByUsername(username);
    return plainToInstance(UserPublicProfileResponseDto, user);
  }

  @Patch('me')
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('find')
  findMany(
    @Body() user: { query: string },
  ): Promise<UserPublicProfileResponseDto[]> {
    return this.usersService.findMany(user);
  }

  @Get('me/wishes')
  findWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findWishesByUser(req.user.id);
  }

  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return this.wishesService.findWishesByUser(user.id);
  }
}
