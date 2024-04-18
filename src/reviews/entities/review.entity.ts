import { User } from 'src/users/entities';
import { Vinyl } from 'src/vinyl/entities';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  score: number;

  @Column()
  comment: string;

  @Column()
  vinylId: string;

  @Column()
  authorId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  author: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews)
  vinyl: Vinyl;
}
