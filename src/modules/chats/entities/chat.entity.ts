import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'enum', enum: ['LOBBY', 'ROOM'], name: 'chat_type' })
  chatType: string;

  @ApiProperty({ type: String })
  @Column({ type: 'uuid', name: 'room_id', nullable: true })
  roomId: string;

  @ApiProperty({ type: String })
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ApiProperty({ type: String })
  @Column({ type: 'text' })
  message: string;

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
