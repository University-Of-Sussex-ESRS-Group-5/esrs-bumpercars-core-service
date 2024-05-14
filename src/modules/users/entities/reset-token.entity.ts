import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reset_tokens')
export class ResetToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    token: string;

    @Column({ type: 'boolean', default: true })
    isValid: boolean;

    @Column({ type: 'uuid' })
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    expiresAt: Date;

    @Column({ type: 'json', nullable: true })
    resetToken: any | null;
}
