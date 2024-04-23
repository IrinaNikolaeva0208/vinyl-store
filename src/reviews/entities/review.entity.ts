import { User } from 'src/users/entities';
import { Vinyl } from 'src/vinyl/entities';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review {
  @ApiProperty({
    description: 'Review ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "User's score",
    example: 2,
    minimum: 1,
    maximum: 5,
  })
  @Column({ type: 'int' })
  score: number;

  @ApiProperty({
    description: "User's comment",
    example:
      'Apparatus defetiscor cubicularis vacuus. Cicuta uredo bis cena. Aranea aranea volutabrum tendo damno titulus nihil subnecto denego.',
  })
  @Column({ type: 'text' })
  comment: string;

  @ApiProperty({
    description: 'Vinyl record ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @Column({ type: 'uuid' })
  vinylId: string;

  @ApiProperty({
    description: 'Review author ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews, { onDelete: 'CASCADE' })
  vinyl: Vinyl;
}
