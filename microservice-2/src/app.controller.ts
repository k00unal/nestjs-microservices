import { Controller, Inject } from '@nestjs/common';
import { AppService, Todo } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * The AppController class handles incoming messages and delegates tasks to the AppService.
 */
@Controller()
export class AppController {
  /**
   * The constructor injects the AppService and a logger instance.
   * @param {AppService} appService - The service to handle business logic.
   * @param {Logger} logger - The logger instance for logging messages.
   */
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * The @MessagePattern decorator listens for messages with the pattern 'get_all_todos'.
   * @returns {Todo[]} An array of todos.
   */
  @MessagePattern('get_all_todos')
  getAllTodos(): Todo[] {
    /** Logs the receipt of a request to get all todos. */
    this.logger.info('Service B: Received request to get all todos');
    /** Calls the appService to retrieve all todos. */
    return this.appService.getAllTodos();
  }

  /**
   * Listens for messages with the pattern 'get_todo_by_id'.
   * @param {{ id: number }} data - The data containing the ID of the todo.
   * @returns {Todo | null} The todo with the specified ID, or null if not found.
   */
  @MessagePattern('get_todo_by_id')
  getTodoById(data: { id: number }): Todo | null {
    /** Logs the receipt of a request to get a todo by ID. */
    this.logger.info(
      `Service B: Received request to get todo by ID ${data.id}`,
    );
    /** Calls the appService to retrieve a todo by its ID. */
    return this.appService.getTodoById(data.id);
  }

  /**
   * Listens for messages with the pattern 'create_todo'.
   * @param {Omit<Todo, 'id'>} todoData - The data for the new todo.
   * @returns {Todo} The newly created todo.
   */
  @MessagePattern('create_todo')
  createTodo(todoData: Omit<Todo, 'id'>): Todo {
    /** Logs the receipt of a request to create a new todo. */
    this.logger.info(
      `Service B: Received request to create todo - ${todoData.title}`,
    );
    /** Calls the appService to create a new todo. */
    return this.appService.createTodo(todoData);
  }

  /**
   * Listens for messages with the pattern 'delete_todo'.
   * @param {{ id: number }} data - The data containing the ID of the todo to delete.
   * @returns {{ success: boolean; message: string }} An object indicating success and a message.
   */
  @MessagePattern('delete_todo')
  deleteTodo(data: { id: number }): { success: boolean; message: string } {
    /** Logs the receipt of a request to delete a todo by ID. */
    this.logger.info(
      `Service B: Received request to delete todo with ID ${data.id}`,
    );
    /** Calls the appService to delete a todo by its ID. */
    const success = this.appService.deleteTodo(data.id);
    /** Returns a success message if the todo was deleted, otherwise a failure message. */
    return {
      success,
      message: success ? 'Todo deleted successfully' : 'Todo not found',
    };
  }
}
