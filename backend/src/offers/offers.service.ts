import { Injectable, ConflictException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, offer: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne(offer.itemId);
    if (user.id === wish.owner.id) {
      throw new ConflictException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }
    if (wish.price < offer.amount + wish.raised) {
      throw new ConflictException(
        'Сумма не должна превышать стоимость подарка',
      );
    }
    await this.wishesService.update(offer.itemId, {
      raised: wish.raised + offer.amount,
    });
    const updatedWish = await this.wishesService.findOne(wish.id);
    return this.offerRepository.save({
      ...offer,
      user,
      item: updatedWish,
    });
  }

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      relations: {
        item: true,
        user: true,
      },
      where: { id },
    });
  }
}
