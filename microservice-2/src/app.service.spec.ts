import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('AppService', () => {
  let service: AppService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            info: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
  });

  it('should retrieve all todos', () => {
    const todos = service.getAllTodos();
    expect(todos).toHaveLength(5);
    expect(logger.info).toHaveBeenCalledWith('Service B: Fetching all todos');
  });

  it('should retrieve a todo by ID', () => {
    const todo = service.getTodoById(1);
    expect(todo).toBeDefined();
    expect(todo?.title).toBe('Buy groceries');
    expect(logger.info).toHaveBeenCalledWith(
      'Service B: Fetching todo with ID 1',
    );
  });

  it('should return null for a non-existent todo ID', () => {
    const todo = service.getTodoById(999);
    expect(todo).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith(
      'Service B: Todo with ID 999 not found',
    );
  });

  it('should create a new todo', () => {
    const newTodo = service.createTodo({
      title: 'New Task',
      description: 'Description of new task',
      completed: false,
    });
    expect(newTodo.id).toBe(6);
    expect(newTodo.title).toBe('New Task');
    expect(logger.info).toHaveBeenCalledWith(
      'Service B: Creating new todo - New Task',
    );
  });

  it('should delete a todo by ID', () => {
    const success = service.deleteTodo(1);
    expect(success).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      'Service B: Deleting todo with ID 1',
    );
  });

  it('should return false when deleting a non-existent todo', () => {
    const success = service.deleteTodo(999);
    expect(success).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith(
      'Service B: Todo with ID 999 not found for deletion',
    );
  });
});
