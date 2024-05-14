import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';
import { Room } from '../../rooms/entities/room.entity';

describe('ChatsService', () => {
  let service: ChatsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: getRepositoryToken(Chat),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getChatHistory', () => {
    it('should call find with the correct parameters when roomId is provided', async () => {
      const fetchChatDto = { roomId: '123' };
      await service.getChatHistory(fetchChatDto);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { roomId: '123' },
        order: { createdAt: 'ASC' },
      });
    });

    it('should call find with the correct parameters when roomId is not provided', async () => {
      const fetchChatDto = {};
      await service.getChatHistory(fetchChatDto);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { chatType: 'LOBBY' },
        order: { createdAt: 'ASC' },
      });
    });
  });
});
