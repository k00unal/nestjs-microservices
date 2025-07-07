import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService, Todo } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

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
            getAllTodos: jest.fn(),
            getTodoById: jest.fn(),
            createTodo: jest.fn(),
            deleteTodo: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getAllTodos', () => {
    it('should return an array of todos', () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Test Todo', description: 'test', completed: false },
      ];
      jest.spyOn(appService, 'getAllTodos').mockReturnValue(mockTodos);

      const todos = appController.getAllTodos();
      expect(todos).toEqual(mockTodos);
      expect(logger.info).toHaveBeenCalledWith(
        'Service B: Received request to get all todos',
      );
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by ID', () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'test',
        completed: false,
      };
      jest.spyOn(appService, 'getTodoById').mockReturnValue(mockTodo);

      const todo = appController.getTodoById({ id: 1 });
      expect(todo).toEqual(mockTodo);
      expect(logger.info).toHaveBeenCalledWith(
        'Service B: Received request to get todo by ID 1',
      );
    });

    it('should return null if todo not found', () => {
      jest.spyOn(appService, 'getTodoById').mockReturnValue(null);

      const todo = appController.getTodoById({ id: 999 });
      expect(todo).toBeNull();
      expect(logger.info).toHaveBeenCalledWith(
        'Service B: Received request to get todo by ID 999',
      );
    });
  });

  describe('createTodo', () => {
    it('should create and return a new todo', () => {
      const todoData = {
        id: 2,
        title: 'New Todo',
        description: 'test',
        completed: false,
      };
      const createdTodo: Todo = { id: 2, description: 'test', ...todoData };
      jest.spyOn(appService, 'createTodo').mockReturnValue(createdTodo);

      const todo = appController.createTodo(todoData);
      expect(todo).toEqual(createdTodo);
      expect(logger.info).toHaveBeenCalledWith(
        'Service B: Received request to create todo - New Todo',
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return success message', () => {
      jest.spyOn(appService, 'deleteTodo').mockReturnValue(true);

      const result = appController.deleteTodo({ id: 1 });
      expect(result).toEqual({
        success: true,
        message: 'Todo deleted successfully',
      });
      expect(logger.info).toHaveBeenCalledWith(
        'Service B: Received request to delete todo with ID 1',
      );
    });

    it('should return failure message if todo not found', () => {
      jest.spyOn(appService, 'deleteTodo').mockReturnValue(false);

      const result = appController.deleteTodo({ id: 999 });
      expect(result).toEqual({ success: false, message: 'Todo not found' });
      expect(logger.info).toHaveBeenCalledWith(
        'Service B: Received request to delete todo with ID 999',
      );
    });
  });
});
