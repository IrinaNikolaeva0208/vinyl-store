import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../../auth/types';
import { Exclude } from 'class-transformer';
import { Review } from 'src/reviews/entities';
import { Purchase } from 'src/purchases/entities/purchase.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  birthdate?: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  role: Role;

  @OneToMany(() => Review, (review) => review.author)
  reviews: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
