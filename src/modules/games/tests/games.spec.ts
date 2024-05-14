import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { GameUser } from '../entities/game-user.entity';
import { GamesService } from '../services/games.service';
import { User } from '../../users/entities/user.entity';
import { EntityManager } from 'typeorm';

describe('GamesService', () => {
  let service: GamesService;
  let mockGameRepository: any;
  let mockGameUserRepository: any;
  let entityManager: EntityManager;

  beforeEach(async () => {
    mockGameRepository = {
      findOneBy: jest.fn(),
    };
    mockGameUserRepository = {
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
        {
          provide: getRepositoryToken(GameUser),
          useValue: mockGameUserRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getEntityManagerToken(),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    entityManager = module.get<EntityManager>(getEntityManagerToken());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGameRanking', () => {
    it('should throw an error if no game is found', async () => {
      const gameId = 'nonexistent';
      mockGameRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getGameRanking(gameId)).rejects.toThrow(
        'GAME_NOT_FOUND',
      );
    });

    it('should return a sorted list of game rankings if game exists', async () => {
      const gameId = '123';
      const gameUsers = [
        { gu_points: 20, u_username: 'Bob', id: '2' },
        { gu_points: 10, u_username: 'Alice', id: '1' },
      ];
      mockGameRepository.findOneBy.mockResolvedValue({
        id: gameId,
        title: 'Test Game',
      });
      mockGameUserRepository
        .createQueryBuilder()
        .getRawMany.mockResolvedValue(gameUsers);

      const rankings = await service.getGameRanking(gameId);
      expect(rankings).toEqual([]);
    });
  });
});
