import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getModelToken } from '@nestjs/mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Model } from 'mongoose';
import { User } from './user.schema';

describe('AppService', () => {
  let appService: AppService;
  let userModel: Model<User>;
  let logger: { info: jest.Mock; error: jest.Mock };

  beforeEach(async () => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            // Mock the constructor and save method
            constructor: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          name: 'John Doe',
          email: '<a href="mailto:john@example.com">john@example.com</a>',
        },
      ];
      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUsers),
      } as any);

      const users = await appService.getUsers();
      expect(users).toEqual(mockUsers);
      expect(logger.info).toHaveBeenCalledWith(
        'Service A: Fetching all users from database',
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Service A: Successfully fetched 1 users from database',
      );
    });

    it('should log an error if fetching users fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(error),
      } as any);

      await expect(appService.getUsers()).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalledWith(
        'Service A: Error fetching users from database - Database error',
      );
    });
  });
});
