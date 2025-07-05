import { Controller, Inject } from '@nestjs/common';
import { AppService, Todo } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @MessagePattern('get_all_todos')
  getAllTodos(): Todo[] {
    this.logger.info('Service B: Received request to get all todos');
    return this.appService.getAllTodos();
  }

  @MessagePattern('get_todo_by_id')
  getTodoById(data: { id: number }): Todo | null {
    this.logger.info(
      `Service B: Received request to get todo by ID ${data.id}`,
    );
    return this.appService.getTodoById(data.id);
  }

  @MessagePattern('create_todo')
  createTodo(todoData: Omit<Todo, 'id'>): Todo {
    this.logger.info(
      `Service B: Received request to create todo - ${todoData.title}`,
    );
    return this.appService.createTodo(todoData);
  }

  @MessagePattern('delete_todo')
  deleteTodo(data: { id: number }): { success: boolean; message: string } {
    this.logger.info(
      `Service B: Received request to delete todo with ID ${data.id}`,
    );
    const success = this.appService.deleteTodo(data.id);
    return {
      success,
      message: success ? 'Todo deleted successfully' : 'Todo not found',
    };
  }
}
