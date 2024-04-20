import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities';
import { Vinyl } from 'src/vinyl/entities';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  vinylId: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.purchases, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.purchases, { onDelete: 'CASCADE' })
  vinyl: Vinyl;
}
