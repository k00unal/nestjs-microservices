import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let logger: { info: jest.Mock; error: jest.Mock };

  beforeEach(async () => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getUsers: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          name: 'John Doe',
          email: '<a href="mailto:john@example.com">john@example.com</a>',
        },
      ];
      jest.spyOn(appService, 'getUsers').mockResolvedValue(mockUsers);

      const users = await appController.getUsers();
      expect(users).toEqual(mockUsers);
      expect(logger.info).toHaveBeenCalledWith(
        'Service A: Received request to get users',
      );
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const userData = {
        name: 'Jane Doe',
        email: '<a href="mailto:jane@example.com">jane@example.com</a>',
      };
      const createdUser = { ...userData, _id: '12345' };
      jest.spyOn(appService, 'createUser').mockResolvedValue(createdUser);

      const user = await appController.createUser(userData);
      expect(user).toEqual(createdUser);
      expect(logger.info).toHaveBeenCalledWith(
        'Service A: Received request to create user - Jane Doe',
      );
    });

    it('should log an error if creating a user fails', async () => {
      const userData = {
        name: 'Jane Doe',
        email: '<a href="mailto:jane@example.com">jane@example.com</a>',
      };
      const error = new Error('Database error');
      jest.spyOn(appService, 'createUser').mockRejectedValue(error);

      await expect(appController.createUser(userData)).rejects.toThrow(
        'Database error',
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Service A: Received request to create user - Jane Doe',
      );
    });
  });
});
