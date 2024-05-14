import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'room_user',
})
export class RoomUser {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'uuid', name: 'room_id' })
  roomId: string;

  @ApiProperty({ type: String })
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255, name: 'car_color' })
  carColor: string;

  @Column({ type: 'enum', enum: ['READY', 'WAITING'], default: 'WAITING' })
  status: string;

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
