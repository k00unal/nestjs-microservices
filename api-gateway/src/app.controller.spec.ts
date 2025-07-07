import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'winston';

describe('AppController', () => {
  let appController: AppController;
  let serviceA: ClientProxy;
  let serviceB: ClientProxy;
  let logger: Logger;

  beforeEach(async () => {
    serviceA = ({
      send: jest.fn(),
    } as unknown) as ClientProxy;

    serviceB = ({
      send: jest.fn(),
    } as unknown) as ClientProxy;

    logger = ({
      info: jest.fn(),
      error: jest.fn(),
    } as unknown) as Logger;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'SERVICE_A',
          useValue: serviceA,
        },
        {
          provide: 'SERVICE_B',
          useValue: serviceB,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getUsersFromServiceA', () => {
    it('should fetch users from Service A', async () => {
      const mockUsers = [
        {
          name: 'John Doe',
          email: '<a href="mailto:john@example.com">john@example.com</a>',
        },
      ];
      jest.spyOn(serviceA, 'send').mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(mockUsers),
      } as any);

      const result = await appController.getUsersFromServiceA();
      expect(result).toEqual(mockUsers);
      expect(logger.info).toHaveBeenCalledWith(
        'API Gateway: Fetching users from Service A',
      );
    });

    it('should log an error if fetching users fails', async () => {
      const error = new Error('Service A error');
      jest.spyOn(serviceA, 'send').mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(error),
      } as any);

      await expect(appController.getUsersFromServiceA()).rejects.toThrow(
        'Service A error',
      );
      expect(logger.error).toHaveBeenCalledWith(
        'API Gateway: Error fetching users from Service A - Service A error',
      );
    });
  });

  describe('createUserInServiceA', () => {
    it('should create a user in Service A', async () => {
      const userData = {
        name: 'Jane Doe',
        email: '<a href="mailto:jane@example.com">jane@example.com</a>',
      };
      const createdUser = { ...userData, id: '12345' };
      jest.spyOn(serviceA, 'send').mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(createdUser),
      } as any);

      const result = await appController.createUserInServiceA(userData);
      expect(result).toEqual(createdUser);
      expect(logger.info).toHaveBeenCalledWith(
        'API Gateway: Creating user in Service A - Jane Doe',
      );
    });

    it('should log an error if creating a user fails', async () => {
      const userData = {
        name: 'Jane Doe',
        email: '<a href="mailto:jane@example.com">jane@example.com</a>',
      };
      const error = new Error('Service A error');
      jest.spyOn(serviceA, 'send').mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(error),
      } as any);

      await expect(
        appController.createUserInServiceA(userData),
      ).rejects.toThrow('Service A error');
      expect(logger.error).toHaveBeenCalledWith(
        'API Gateway: Error creating user in Service A - Service A error',
      );
    });
  });

  describe('getAllTodos', () => {
    it('should fetch all todos from Service B', async () => {
      const mockTodos = [
        { title: 'Todo 1', description: 'Description 1', completed: false },
      ];
      jest.spyOn(serviceB, 'send').mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(mockTodos),
      } as any);

      const result = await appController.getAllTodos();
      expect(result).toEqual(mockTodos);
      expect(logger.info).toHaveBeenCalledWith(
        'API Gateway: Fetching all todos from Service B',
      );
    });

    it('should log an error if fetching todos fails', async () => {
      const error = new Error('Service B error');
      jest.spyOn(serviceB, 'send').mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(error),
      } as any);

      await expect(appController.getAllTodos()).rejects.toThrow(
        'Service B error',
      );
      expect(logger.error).toHaveBeenCalledWith(
        'API Gateway: Error fetching todos from Service B - Service B error',
      );
    });
  });

  describe('createTodo', () => {
    it('should create a todo in Service B', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
        completed: false,
      };
      const createdTodo = { ...todoData, id: '67890' };
      jest.spyOn(serviceB, 'send').mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(createdTodo),
      } as any);

      const result = await appController.createTodo(todoData);
      expect(result).toEqual(createdTodo);
      expect(logger.info).toHaveBeenCalledWith(
        'API Gateway: Creating todo in Service B - New Todo',
      );
    });

    it('should log an error if creating a todo fails', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
        completed: false,
      };
      const error = new Error('Service B error');
      jest.spyOn(serviceB, 'send').mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(error),
      } as any);

      await expect(appController.createTodo(todoData)).rejects.toThrow(
        'Service B error',
      );
      expect(logger.error).toHaveBeenCalledWith(
        'API Gateway: Error creating todo in Service B - Service B error',
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo from Service B', async () => {
      const mockResult = { success: true };
      jest.spyOn(serviceB, 'send').mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await appController.deleteTodo('1');
      expect(result).toEqual(mockResult);
      expect(logger.info).toHaveBeenCalledWith(
        'API Gateway: Deleting todo with ID 1 from Service B',
      );
    });

    it('should log an error if deleting a todo fails', async () => {
      const error = new Error('Service B error');
      jest.spyOn(serviceB, 'send').mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(error),
      } as any);

      await expect(appController.deleteTodo('1')).rejects.toThrow(
        'Service B error',
      );
      expect(logger.error).toHaveBeenCalledWith(
        'API Gateway: Error deleting todo 1 from Service B - Service B error',
      );
    });
  });
});
