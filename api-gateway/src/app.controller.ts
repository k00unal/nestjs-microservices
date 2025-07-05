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

@Controller()
export class AppController {
  constructor(
    @Inject('SERVICE_A') private readonly serviceA: ClientProxy,
    @Inject('SERVICE_B') private readonly serviceB: ClientProxy,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

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
