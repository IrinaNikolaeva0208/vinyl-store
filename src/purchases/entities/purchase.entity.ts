import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities';
import { Vinyl } from 'src/vinyl/entities';
import { ApiProperty, PickType } from '@nestjs/swagger';

@Entity()
export class Purchase {
  @ApiProperty({
    description: 'Purchase ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Purchaser ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({
    description: 'Purchased vinyl record ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @Column({ type: 'uuid' })
  vinylId: string;

  @ApiProperty({
    description: 'Purchase creation timestamp',
    example: 1713600184628,
  })
  @Column({ type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.purchases, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    description: 'Purchased vinyl',
    required: false,
    type: () => PickType(Vinyl, ['name', 'authorName', 'price']),
  })
  @ManyToOne(() => Vinyl, (vinyl) => vinyl.purchases, { onDelete: 'CASCADE' })
  vinyl: Vinyl;
}
