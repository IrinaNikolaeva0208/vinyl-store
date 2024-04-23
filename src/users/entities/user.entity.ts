import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../../auth/types';
import { Exclude } from 'class-transformer';
import { Review } from 'src/reviews/entities';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NO_PHOTO_URL } from 'src/utils/constants';

@Entity()
export class User {
  @ApiProperty({
    description: 'User ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @Column({ type: 'text' })
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @Column({ type: 'text' })
  lastName: string;

  @ApiProperty({
    description: "User's birthdate",
    example: 'John',
    nullable: true,
  })
  @Column({ type: 'date', nullable: true })
  birthdate?: string;

  @ApiProperty({
    description: "User's avatar",
    example: NO_PHOTO_URL,
  })
  @Column({ type: 'text' })
  avatar: string;

  @ApiProperty({
    description: "User's email",
    example: 'taffy.grrr@gmail.com',
  })
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
