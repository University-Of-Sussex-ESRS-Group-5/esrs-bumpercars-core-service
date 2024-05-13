import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import * as bcrypt from 'bcrypt';
import { CommonService } from '../../common/services/common.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private commonService: CommonService,
  ) {}

  async getListUsers(query: {
    limit?: number;
    offset?: number;
  }): Promise<UserDTO[]> {
    const { limit, offset } = query;
    const users = await this.userRepository.find({
      select: ['id', 'username', 'email', 'points', 'createdAt', 'updatedAt'],
      skip: offset,
      take: limit,
    });
    return users;
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<UserDTO> {
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.username = username;
    user.points = 0;
    return this.userRepository.save(user);
  }

  async signin(usernameOrEmail: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new ApiError(ErrorCode.WRONG_USER_OR_PASSWORD);
    }
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(ErrorCode.WRONG_USER_OR_PASSWORD);
    }
    const token = await this.commonService.signToken({
      userId: user.id,
    });
    return {
      user,
      token,
    };
  }

  async getPublicRanking(): Promise<UserDTO[]> {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'points'],
      order: { points: 'DESC' },
      take: 10,
    });
    return users;
  }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            },
            select: ['id', 'username', 'email', 'points', 'createdAt', 'updatedAt'],
        });
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                id: id,
            },
            select: ['id', 'username', 'email', 'points', 'createdAt', 'updatedAt'],
        });
    }

    async getRanking() {
        return this.userRepository.find({
            select: ['email', 'id', 'points', 'username'],
            order: {
                points: 'DESC',
            },
        });
    }
}
