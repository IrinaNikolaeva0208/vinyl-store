import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities';
import { Vinyl } from 'src/vinyl/entities';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  vinylId: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.purchases)
  vinyl: Vinyl;
}
