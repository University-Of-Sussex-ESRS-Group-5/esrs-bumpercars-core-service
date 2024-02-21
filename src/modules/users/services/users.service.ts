import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getListUsers(
        query: { limit?: number; offset?: number },
    ): Promise<UserDTO[]> {
        const { limit, offset } = query;
        const users = await this.userRepository.find({
            select: ['id', 'username', 'email', 'points', 'createdAt', 'updatedAt'],
            skip: offset,
            take: limit,
        });
        return users;
    }
}