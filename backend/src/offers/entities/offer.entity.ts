import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { IsNotEmpty, IsBoolean } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @IsNotEmpty()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @IsNotEmpty()
  @Column()
  amount: number;

  @IsBoolean()
  @Column({
    default: false,
  })
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
