import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { RoomUser } from '../entities/room-user.entity';
import { User } from '../../users/entities/user.entity';
import { Game } from '../../games/entities/game.entity';
import { RoomsService } from '../services/rooms.service';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;
  let roomRepository: Partial<Repository<Room>>;
  let roomUserRepository: Partial<Repository<RoomUser>>;
  let userRepository: Partial<Repository<User>>;
  let gameRepository: Partial<Repository<Game>>;

  beforeEach(async () => {
    roomRepository = {
      find: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    roomUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };
    userRepository = {
      findOne: jest.fn(),
    };
    gameRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Room),
          useValue: roomRepository,
        },
        {
          provide: getRepositoryToken(RoomUser),
          useValue: roomUserRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(Game),
          useValue: gameRepository,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    roomRepository = module.get(getRepositoryToken(Room));
    roomUserRepository = module.get(getRepositoryToken(RoomUser));
    userRepository = module.get(getRepositoryToken(User));
    gameRepository = module.get(getRepositoryToken(Game));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListRooms', () => {
    it('should return an array of rooms', async () => {
      const mockRooms = [{ id: '1', name: 'Test Room' }];
      (roomRepository.find as jest.Mock).mockResolvedValue(mockRooms);
      const query = { limit: 1, offset: 0 };
      const result = await service.getListRooms(query);
      expect(result).toEqual(mockRooms);
      expect(roomRepository.find).toHaveBeenCalledWith({ take: 1, skip: 0 });
    });
  });

  describe('createRoom', () => {
    it('should throw an error if room already exists', async () => {
      const mockRoomDto = {
        code: 'TESTCODE',
        type: 'PUBLIC',
        status: 'WAITING',
        leaderID: 'leaderId',
      };
      (roomRepository.findOne as jest.Mock).mockResolvedValue({ id: '1' });
      await expect(
        service.createRoom(
          mockRoomDto.code,
          mockRoomDto.type as any,
          mockRoomDto.status as any,
          mockRoomDto.leaderID,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should save and return the created room', async () => {
      const mockRoomDto = {
        code: 'TESTCODE',
        type: 'PUBLIC',
        status: 'WAITING',
        leaderID: 'leaderId',
      };
      const mockRoom = { ...mockRoomDto, id: '2' };
      (roomRepository.findOne as jest.Mock).mockResolvedValue(null);
      (roomRepository.save as jest.Mock).mockResolvedValue(mockRoom);
      const result = await service.createRoom(
        mockRoomDto.code,
        mockRoomDto.type as any,
        mockRoomDto.status as any,
        mockRoomDto.leaderID,
      );
      expect(result).toEqual(mockRoom);
      expect(roomRepository.save).toHaveBeenCalledWith({
        code: 'TESTCODE',
        leaderId: 'leaderId',
        status: 'WAITING',
        type: 'PUBLIC',
      });
    });
  });

  describe('joinRoom', () => {
    it('should throw an error if room does not exist', async () => {
      const joinRoomDto = { roomId: '1', userId: '1', carColor: 'blue' };
      (roomRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        service.joinRoom(
          joinRoomDto.roomId,
          joinRoomDto.userId,
          joinRoomDto.carColor,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw an error if user already in the room', async () => {
      const joinRoomDto = { roomId: '1', userId: '1', carColor: 'blue' };
      (roomRepository.findOne as jest.Mock).mockResolvedValue({ id: '1' });
      (roomUserRepository.findOne as jest.Mock).mockResolvedValue({ id: '1' });
      await expect(
        service.joinRoom(
          joinRoomDto.roomId,
          joinRoomDto.userId,
          joinRoomDto.carColor,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should return a room user object when a room is found', async () => {
      const joinRoomDto = { roomId: '1', userId: '1', carColor: 'blue' };
      const mockRoomUser = { roomId: '1', userId: '1', carColor: 'blue' };
      (roomRepository.findOne as jest.Mock).mockResolvedValue({ id: '1' });
      (roomUserRepository.findOne as jest.Mock).mockResolvedValue(null);
      (roomUserRepository.save as jest.Mock).mockResolvedValue(mockRoomUser);
      const result = await service.joinRoom(
        joinRoomDto.roomId,
        joinRoomDto.userId,
        joinRoomDto.carColor,
      );
      expect(result).toEqual(mockRoomUser);
      expect(roomUserRepository.save).toHaveBeenCalledWith(mockRoomUser);
    });
  });

  describe('changeCarColor', () => {
    it('should throw an error if room user does not exist', async () => {
      const changeColorDto = { roomId: '2', userId: '1', carColor: 'green' };
      (roomUserRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.changeCarColor(changeColorDto)).rejects.toThrow(
        'ROOM_NOT_FOUND',
      );
    });

    it('should update the car color and return the updated room user', async () => {
      const changeColorDto = { roomId: '2', userId: '1', carColor: 'green' };
      const mockRoomUser = { roomId: '2', userId: '1', carColor: 'blue' };
      (roomUserRepository.findOne as jest.Mock).mockResolvedValue(mockRoomUser);
      const updatedRoomUser = { ...mockRoomUser, carColor: 'green' };
      (roomUserRepository.save as jest.Mock).mockResolvedValue(updatedRoomUser);
      const result = await service.changeCarColor(changeColorDto);
      expect(result.carColor).toBe('green');
      expect(roomUserRepository.findOne).toHaveBeenCalledWith({
        where: { roomId: '2', userId: '1' },
      });
      expect(roomUserRepository.save).toHaveBeenCalledWith(mockRoomUser);
    });
  });
});
