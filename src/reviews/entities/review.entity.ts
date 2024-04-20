import { User } from 'src/users/entities';
import { Vinyl } from 'src/vinyl/entities';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'uuid' })
  vinylId: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews, { onDelete: 'CASCADE' })
  vinyl: Vinyl;
}
