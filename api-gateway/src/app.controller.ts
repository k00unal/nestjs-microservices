import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'winston';

/**
 * The AppController class handles HTTP requests and communicates with
 * microservices to perform operations related to users and todos.
 */
@Controller()
export class AppController {
  /**
   * Constructs an instance of AppController.
   * @param {ClientProxy} serviceA - Client proxy for communicating with Service A.
   * @param {ClientProxy} serviceB - Client proxy for communicating with Service B.
   * @param {Logger} logger - Logger instance for logging messages.
   */
  constructor(
    @Inject('SERVICE_A') private readonly serviceA: ClientProxy,
    @Inject('SERVICE_B') private readonly serviceB: ClientProxy,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Handles GET requests to '/service-a/users' to fetch users from Service A.
   * @returns {Promise<any>} A promise that resolves to an array of users.
   */
  @Get('/service-a/users')
  async getUsersFromServiceA() {
    this.logger.info('API Gateway: Fetching users from Service A');
    try {
      const result = await this.serviceA.send('get_users', {}).toPromise();
      this.logger.info(
        `API Gateway: Successfully fetched ${result?.length ||
          0} users from Service A`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `API Gateway: Error fetching users from Service A - ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handles POST requests to '/service-a/users' to create a user in Service A.
   * @param {Object} userData - The data for the new user.
   * @param {string} userData.name - The name of the user.
   * @param {string} userData.email - The email of the user.
   * @param {number} [userData.age] - The optional age of the user.
   * @returns {Promise<any>} A promise that resolves to the created user.
   */
  @Post('/service-a/users')
  async createUserInServiceA(
    @Body() userData: { name: string; email: string; age?: number },
  ) {
    this.logger.info(
      `API Gateway: Creating user in Service A - ${userData.name}`,
    );
    try {
      const result = await this.serviceA
        .send('create_user', userData)
        .toPromise();
      this.logger.info(
        `API Gateway: Successfully created user in Service A - ${userData.name}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `API Gateway: Error creating user in Service A - ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handles GET requests to '/service-b/todos' to fetch all todos from Service B.
   * @returns {Promise<any>} A promise that resolves to an array of todos.
   */
  @Get('/service-b/todos')
  async getAllTodos() {
    this.logger.info('API Gateway: Fetching all todos from Service B');
    try {
      const result = await this.serviceB.send('get_all_todos', {}).toPromise();
      this.logger.info(
        `API Gateway: Successfully fetched ${result?.length ||
          0} todos from Service B`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `API Gateway: Error fetching todos from Service B - ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handles POST requests to '/service-b/todos' to create a todo in Service B.
   * @param {Object} todoData - The data for the new todo.
   * @param {string} todoData.title - The title of the todo.
   * @param {string} todoData.description - The description of the todo.
   * @param {boolean} todoData.completed - The completion status of the todo.
   * @returns {Promise<any>} A promise that resolves to the created todo.
   */
  @Post('/service-b/todos')
  async createTodo(
    @Body()
    todoData: {
      title: string;
      description: string;
      completed: boolean;
    },
  ) {
    this.logger.info(
      `API Gateway: Creating todo in Service B - ${todoData.title}`,
    );
    try {
      const result = await this.serviceB
        .send('create_todo', todoData)
        .toPromise();
      this.logger.info(
        `API Gateway: Successfully created todo in Service B - ${todoData.title}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `API Gateway: Error creating todo in Service B - ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handles DELETE requests to '/service-b/todos/:id' to delete a todo from Service B.
   * @param {string} id - The ID of the todo to delete.
   * @returns {Promise<any>} A promise that resolves to the result of the deletion.
   */
  @Delete('/service-b/todos/:id')
  async deleteTodo(@Param('id') id: string) {
    this.logger.info(`API Gateway: Deleting todo with ID ${id} from Service B`);
    try {
      const result = await this.serviceB
        .send('delete_todo', { id: parseInt(id) })
        .toPromise();
      this.logger.info(
        `API Gateway: Successfully deleted todo with ID ${id} from Service B`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `API Gateway: Error deleting todo ${id} from Service B - ${error.message}`,
      );
      throw error;
    }
  }
}
