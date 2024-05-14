import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ResetTokenRepository } from './repositories/reset-token.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService, ResetTokenRepository],
})
export class UsersModule {}
