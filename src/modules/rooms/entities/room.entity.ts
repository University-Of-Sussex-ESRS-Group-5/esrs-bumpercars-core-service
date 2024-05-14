import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IRoomType } from '../typings/room.type';

@Entity()
export class Room {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255 })
  code: string;

  @ApiProperty({ enum: IRoomType, enumName: 'RoomType' })
  @Column({ type: 'enum', enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' })
  type: string;

  @ApiProperty({ enum: ['INGAME', 'WAITING'], enumName: 'RoomStatus' })
  @Column({ type: 'enum', enum: ['INGAME', 'WAITING'], default: 'WAITING' })
  status: string;

  @ApiProperty({ type: String })
  @Column({ type: 'uuid', name: 'leader_id' })
  leaderId: string;

  @ApiProperty({ type: [User] })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  public createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  public updatedAt: Date;
}
