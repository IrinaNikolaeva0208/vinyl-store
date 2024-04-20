import { Purchase } from 'src/purchases/entities/purchase.entity';
import { Review } from 'src/reviews/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Vinyl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  authorName: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text' })
  image: string;

  @OneToMany(() => Review, (review) => review.vinyl, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.vinyl, {
    cascade: true,
  })
  purchases: Purchase[];
}
