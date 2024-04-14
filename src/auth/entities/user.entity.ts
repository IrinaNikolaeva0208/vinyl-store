import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../types';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  birthdate?: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column()
  role: Role;
}
