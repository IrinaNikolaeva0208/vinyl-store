import { Purchase } from 'src/purchases/entities/purchase.entity';
import { Review } from 'src/reviews/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NO_PHOTO_URL } from 'src/utils/constants';

@Entity()
export class Vinyl {
  @ApiProperty({
    description: 'Vinyl ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Vinyl record name',
    example: 'Lorem',
  })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({
    description: 'Vinyl record description',
    example:
      '31c32908-abd3-4897-be47-88bdaaef0bc1Apparatus defetiscor cubicularis vacuus. Cicuta uredo bis cena. Aranea aranea volutabrum tendo damno titulus nihil subnecto denego.',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: "Vinyl record author's name",
    example: 'Carrie Turner-Klocko',
  })
  @Column({ type: 'text' })
  authorName: string;

  @ApiProperty({
    description: 'Vinyl record price',
    example: 10.99,
    minimum: 0.05,
  })
  @Column({ type: 'float' })
  price: number;

  @ApiProperty({
    description: "User's avatar",
    example: NO_PHOTO_URL,
  })
  @Column({ type: 'text' })
  image: string;

  @OneToMany(() => Review, (review) => review.vinyl, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.vinyl, {
    cascade: true,
  })
  purchases: Purchase[];
}
