import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity as OperationOn, Operation } from '../../utils/types';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Operation })
  operation: Operation;

  @Column({ type: 'enum', enum: OperationOn })
  entity: OperationOn;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'uuid' })
  performedByUser: string;
}
