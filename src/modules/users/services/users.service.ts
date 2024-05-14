import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import * as bcrypt from 'bcrypt';
import { CommonService } from '../../common/services/common.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetTokenRepository } from '../repositories/reset-token.repository';
import { ResetToken } from '../entities/reset-token.entity';
import * as crypto from 'crypto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private commonService: CommonService,
    private readonly mailerService: MailerService,
    private resetTokenRepository: ResetTokenRepository,
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

  async forgetPassword(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('User with this email does not exist.');
    }
    const resetToken = this.generateResetToken();
    await this.saveResetToken(user.id, resetToken);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset', // path to the email template
      context: {
        name: user.username,
        resetToken,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    // Use your user repository to find the user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User with this email does not exist.');
    }
    return user;
  }
  
  async getUserById(id: string): Promise<User> {
    // Use your user repository to find the user by id
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User with this id does not exist.');
    }
    return user;
  }
  
  
  

  private generateResetToken(): string {
    const token = require('crypto').randomBytes(32).toString('hex');
    return token;
  }

  async saveResetToken(userId: string, resetToken: string): Promise<void> {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1); // Token expires in 1 hour

    // Assuming 'ResetToken' is a separate entity that stores the tokens
    const existingToken = await this.resetTokenRepository.findOne({
      where: { userId: userId }
    });
    if (existingToken) {
      // If a token exists, update it
      await this.resetTokenRepository.update({ userId: userId }, {
        token: resetToken,
        expiresAt: expirationTime
      });
    } else {
      // If no token exists, create a new one
      await this.resetTokenRepository.insert({
        userId: userId,
        token: resetToken,
        expiresAt: expirationTime
      });
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Validate the reset token and find the associated user
    const userId = await this.validateResetToken(token);
    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }

    // Update the user's password
    await this.updateUserPassword(userId, newPassword);

    // Invalidate the reset token so it can't be used again
    await this.invalidateResetToken(token);
  }

  private async validateResetToken(token: string): Promise<string | null> {
    // Implementation to validate the reset token
    // This should check if the token exists and has not expired
    const resetTokenRecord = await this.findResetToken(token);
    if (!resetTokenRecord || new Date() > resetTokenRecord.expiresAt) {
      return null;
    }
    return resetTokenRecord.userId;
  }

  async findResetToken(token: string): Promise<ResetToken | null> {
    return await this.resetTokenRepository.findOne({
      where: { token: token },
      select: ['userId', 'token', 'expiresAt'],
    });
  }

  private async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    try {
        // Implementation to update the user's password
        // This should securely hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Fetch the user from the database
        const user = await this.getUserById(userId);
        if (!user) {
          console.error(`User with ID ${userId} not found.`);
          throw new Error(`User with ID ${userId} not found.`);
      }

      // Update the user's password
      user.password = hashedPassword;

      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user password:', error.message);
      // Handle the error appropriately (e.g., log it, return an error response, etc.)
      throw error;
  }
}

private async invalidateResetToken(token: string): Promise<void> {
  try {
      // Fetch the user associated with the reset token from the database
      // const user = await this.userRepository.findOne({ where: { resetToken: token } });
      const user = await this.findResetToken(token);

        if (!user) {
            throw new Error(`User with reset token ${token} not found.`);
        }

        // Invalidate the reset token
        user.resetToken = null;

        // Save the updated user to the database
        await this.userRepository.save(user);
    } catch (error) {
        console.error('Error invalidating reset token:', error.message);
          // Handle the error appropriately (e.g., log it, return an error response, etc.)
          throw error;
        }
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<UserDTO> {
    // Check if a user with the provided email already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ApiError(ErrorCode.USERNAME_ALREADY_EXIST);
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ApiError(ErrorCode.USER_WITH_EMAIL_ALREADY_EXIST);
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
    return this.userRepository.save(newUser);
  }

  async signin(usernameOrEmail: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      select: ['id', 'username', 'email', 'password'],
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
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
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
