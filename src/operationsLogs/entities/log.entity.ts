import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity as OperationOn, Operation } from '../../utils/types';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Log {
  @ApiProperty({
    description: 'Log ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Operation type',
    example: Operation.CREATE,
    enum: Operation,
  })
  @Column({ type: 'enum', enum: Operation })
  operation: Operation;

  @ApiProperty({
    description: 'Entity type',
    example: OperationOn.PURCHASE,
    enum: OperationOn,
  })
  @Column({ type: 'enum', enum: OperationOn })
  entity: OperationOn;

  @ApiProperty({
    description: 'Entity ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @Column({ type: 'uuid' })
  entityId: string;

  @ApiProperty({
    description: 'Vinyl ID',
    example: 1713600184628,
  })
  @Column({ type: 'bigint' })
  createdAt: number;

  @ApiProperty({
    description: 'Performer ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @Column({ type: 'uuid' })
  performedByUser: string;
}
