import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonService } from '../../common/services/common.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Partial<Repository<User>>;
  let commonService: Partial<CommonService>;

  beforeEach(async () => {
    userRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    commonService = {
      signToken: jest.fn().mockResolvedValue('mockToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: CommonService,
          useValue: commonService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListUsers', () => {
    it('should return an array of user DTOs', async () => {
      const mockUsers = [
        { id: '1', username: 'JohnDoe', email: 'john@example.com' },
      ];
      (userRepository.find as jest.Mock).mockResolvedValue(mockUsers);
      const result = await service.getListUsers({ limit: 1, offset: 0 });
      expect(result).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalledWith({
        select: ['id', 'username', 'email', 'points', 'createdAt', 'updatedAt'],
        skip: 0,
        take: 1,
      });
    });
  });

  describe('register', () => {
    it('should save and return the registered user', async () => {
      const mockUser = {
        email: 'new@example.com',
        username: 'NewUser',
        password: 'hashedPassword',
      };
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.register(
        'new@example.com',
        'password123',
        'NewUser',
      );
      expect(result).toEqual(mockUser);
      expect(userRepository.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('signin', () => {
    it('should authenticate and return token and user', async () => {
      const mockUser = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashedPassword',
      };
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.signin('user1@example.com', 'password123');
      expect(result).toEqual({ user: mockUser, token: 'mockToken' });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(commonService.signToken).toHaveBeenCalledWith({ userId: '1' });
    });

    it('should throw an error if user not found or password is incorrect', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        service.signin('nonexistent@example.com', 'password'),
      ).rejects.toThrow('WRONG_USER_OR_PASSWORD');
    });
  });

  describe('getPublicRanking', () => {
    it('should return a sorted list of users by points', async () => {
      const mockUsers = [{ id: '2', username: 'user2', points: 50 }];
      (userRepository.find as jest.Mock).mockResolvedValue(mockUsers);
      const result = await service.getPublicRanking();
      expect(result).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalledWith({
        select: ['id', 'username', 'points'],
        order: { points: 'DESC' },
        take: 10,
      });
    });
  });
});
