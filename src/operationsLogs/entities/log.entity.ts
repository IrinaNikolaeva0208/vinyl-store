import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity as OperationOn, Operation } from '../types';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operation: Operation;

  @Column()
  entity: OperationOn;

  @Column()
  entityId: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column()
  perfomedByUser: string;
}
