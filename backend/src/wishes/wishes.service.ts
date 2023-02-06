import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(owner: User, wish: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save({
      ...wish,
      owner,
    });
  }

  findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true },
        offers: { user: true, item: true },
      },
      where: { id },
    });
  }

  findMany(wishlist): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(wishlist.itemsId) },
    });
  }

  findWishesByUser(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: {
        owner: { wishes: true, wishlists: true },
        offers: { user: true, item: true },
      },
      where: { owner: { id } },
    });
  }

  update(id: number, wishlist: UpdateWishDto) {
    return this.wishRepository.update({ id }, wishlist);
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }

  async copy(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);
    const copyWish = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    await this.wishRepository.update(wish.id, { copied: +1 });
    return this.create(user, copyWish);
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 10,
      order: { copied: 'DESC' },
    });
  }
}
