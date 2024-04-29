import { User } from '@modules/users/entities/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'leader_id' })
  leader: User;

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
