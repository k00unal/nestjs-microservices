import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * Defines the structure of a Todo item.
 */
export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * The AppService class provides business logic for managing todos.
 */
@Injectable()
export class AppService {
  /**
   * Injects a Winston logger into the service.
   * @param {Logger} logger - The logger instance for logging messages.
   */
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * An array to store todos, initialized with some sample data.
   * @private
   * @type {Todo[]}
   */
  private readonly todos: Todo[] = [
    {
      id: 1,
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, and fruits',
      completed: false,
    },
    {
      id: 2,
      title: 'Read a book',
      description: 'Finish reading “Clean Code”',
      completed: false,
    },
    {
      id: 3,
      title: 'Workout',
      description: '30 minutes of cardio',
      completed: true,
    },
    {
      id: 4,
      title: 'Call mom',
      description: 'Catch up on the weekend',
      completed: false,
    },
    {
      id: 5,
      title: 'Finish project report',
      description: 'Due by Friday',
      completed: false,
    },
  ];

  /**
   * A counter to generate unique IDs for new todos.
   * @private
   * @type {number}
   */
  private nextId = 6;

  /**
   * Retrieves all todos.
   * @returns {Todo[]} An array of todos.
   */
  getAllTodos(): Todo[] {
    this.logger.info('Service B: Fetching all todos');
    this.logger.info(`Service B: Returning ${this.todos.length} todos`);
    return this.todos;
  }

  /**
   * Retrieves a todo by its ID.
   * @param {number} id - The ID of the todo to retrieve.
   * @returns {Todo | null} The todo with the specified ID, or null if not found.
   */
  getTodoById(id: number): Todo | null {
    this.logger.info(`Service B: Fetching todo with ID ${id}`);
    const todo = this.todos.find((todo) => todo.id === id) || null;
    if (todo) {
      this.logger.info(`Service B: Found todo - ${todo.title}`);
    } else {
      this.logger.warn(`Service B: Todo with ID ${id} not found`);
    }
    return todo;
  }

  /**
   * Creates a new todo.
   * @param {Omit<Todo, 'id'>} todoData - The data for the new todo.
   * @returns {Todo} The newly created todo.
   */
  createTodo(todoData: Omit<Todo, 'id'>): Todo {
    this.logger.info(`Service B: Creating new todo - ${todoData.title}`);
    const newTodo: Todo = {
      id: this.nextId++,
      ...todoData,
    };
    this.todos.push(newTodo);
    this.logger.info(
      `Service B: Successfully created todo - ${newTodo.title} with ID ${newTodo.id}`,
    );
    return newTodo;
  }

  /**
   * Deletes a todo by its ID.
   * @param {number} id - The ID of the todo to delete.
   * @returns {boolean} True if the todo was deleted, false if not found.
   */
  deleteTodo(id: number): boolean {
    this.logger.info(`Service B: Deleting todo with ID ${id}`);
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      this.logger.warn(`Service B: Todo with ID ${id} not found for deletion`);
      return false;
    }
    this.todos.splice(todoIndex, 1);
    this.logger.info(`Service B: Successfully deleted todo with ID ${id}`);
    return true;
  }
}
