import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { RoomUser } from '../entities/room-user.entity';
import { RoomsService } from '../services/rooms.service';
import { Repository } from 'typeorm';

describe('RoomsService', () => {
  let service: RoomsService;
  let roomRepository: Partial<Repository<Room>>;
  let roomUserRepository: Partial<Repository<RoomUser>>;

  beforeEach(async () => {
    roomRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    roomUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
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
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    roomRepository = module.get(getRepositoryToken(Room));
    roomUserRepository = module.get(getRepositoryToken(RoomUser));
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
    it('should save and return the created room', async () => {
      const mockRoomDto = { type: 'PUBLIC', leaderId: 'leaderId' };
      const mockRoom = { ...mockRoomDto, id: '2', code: 'ABCDEFGH' };
      (roomRepository.create as jest.Mock).mockReturnValue(mockRoom);
      (roomRepository.save as jest.Mock).mockResolvedValue(mockRoom);
      const result = await service.createRoom(mockRoomDto);
      expect(result).toEqual(mockRoom);
      expect(roomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(mockRoomDto),
      );
      expect(roomRepository.save).toHaveBeenCalledWith(mockRoom);
    });
  });

  describe('joinRoom', () => {
    it('should throw an error if no room is found', async () => {
      const joinRoomDto = { userId: '1', carColor: 'blue' };
      (roomRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.joinRoom(joinRoomDto)).rejects.toThrow(
        'ROOM_NOT_FOUND',
      );
    });

    it('should return a room user object when a room is found', async () => {
      const joinRoomDto = { code: 'ABCDEFGH', userId: '1', carColor: 'red' };
      const mockRoom = { id: '2', type: 'PUBLIC', status: 'WAITING' };
      const mockRoomUser = { roomId: '2', userId: '1', carColor: 'red' };
      (roomRepository.findOne as jest.Mock).mockResolvedValue(mockRoom);
      (roomUserRepository.create as jest.Mock).mockReturnValue(mockRoomUser);
      (roomUserRepository.save as jest.Mock).mockResolvedValue(mockRoomUser);
      const result = await service.joinRoom(joinRoomDto);
      expect(result).toEqual(mockRoomUser);
      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'ABCDEFGH', status: 'WAITING' },
      });
      expect(roomUserRepository.create).toHaveBeenCalledWith(mockRoomUser);
      expect(roomUserRepository.save).toHaveBeenCalledWith(mockRoomUser);
    });
  });

  describe('changeCarColor', () => {
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
      expect(roomUserRepository.save).toHaveBeenCalledWith(updatedRoomUser);
    });
  });
});
