import { Review } from 'src/reviews/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Vinyl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  authorName: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  image: string;

  @OneToMany(() => Review, (review) => review.vinyl)
  reviews: Review[];
}
