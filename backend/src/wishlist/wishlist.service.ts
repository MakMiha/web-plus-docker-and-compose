import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async create(id: number, wishlist: CreateWishlistDto): Promise<Wishlist> {
    const user = await this.usersService.findOne(id);
    const wishes = await this.wishesService.findMany(wishlist);
    return this.wishListRepository.save({
      ...wishlist,
      owner: user,
      items: wishes,
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishListRepository.find({
      relations: { items: true, owner: true },
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishListRepository.findOne({
      relations: { items: true, owner: true },
      where: { id },
    });
  }

  update(id: number, wishlist: UpdateWishlistDto) {
    return this.wishListRepository.update({ id }, wishlist);
  }

  remove(id: number) {
    return this.wishListRepository.delete({ id });
  }
}
