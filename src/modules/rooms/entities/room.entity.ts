import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'enum', enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' })
  type: string;

  @Column({ type: 'enum', enum: ['INGAME', 'WAITING'], default: 'WAITING' })
  status: string;

  @Column({ type: 'uuid', name: 'leader_id' })
  leaderId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  public updatedAt: Date;
}
