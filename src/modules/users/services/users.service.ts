import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtResponse } from '../dtos/login-success.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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

  async registerUser(query: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username, email, password } = query;

    // Check if a user with the provided email already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt or any other secure password hashing library

    // Create a new user
    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.username = username;
    newUser.points = 0;

    // Save the new user to the database
    await this.userRepository.save(newUser);
  }

  async loginUserWithUsername(query: {
    username: string;
    password: string;
  }): Promise<JwtResponse> {
    const { username, password } = query;

    // Check if a user with the provided email already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password'],
    });
    if (existingUser) {
      const hashStatus = await bcrypt.compare(password, existingUser.password);
      // Use bcrypt or any other secure password hashing library
      if (hashStatus) {
        const payload = {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new UnauthorizedException('Incorrect Password');
      }
    }
    throw new ConflictException('User with this username does not exists');
  }

  async loginUserWithEmail(query: {
    email: string;
    password: string;
  }): Promise<JwtResponse> {
    const { email, password } = query;

    // Check if a user with the provided email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
    if (existingUser) {
      const hashStatus = await bcrypt.compare(password, existingUser.password);
      // Use bcrypt or any other secure password hashing library
      if (hashStatus) {
        const payload = {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new UnauthorizedException('Incorrect Password');
      }
    }
    throw new ConflictException('User with this email does not exists');
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
