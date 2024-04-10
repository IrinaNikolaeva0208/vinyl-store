import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  price: number;

  @Column()
  image: string;
}
