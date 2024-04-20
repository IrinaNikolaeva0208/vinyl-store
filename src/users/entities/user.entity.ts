import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../../auth/types';
import { Exclude } from 'class-transformer';
import { Review } from 'src/reviews/entities';
import { Purchase } from 'src/purchases/entities/purchase.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthdate?: string;

  @Column({ type: 'text' })
  avatar: string;

  @Column({ type: 'text' })
  email: string;

  @Exclude()
  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToMany(() => Review, (review) => review.author, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.user, {
    cascade: true,
  })
  purchases: Purchase[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
