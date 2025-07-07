import { Body, Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

/**
 * The AppController class handles incoming messages and delegates tasks to the AppService.
 */
@Controller()
export class AppController {
  /**
   * Constructs an instance of AppController.
   * @param {AppService} appService - The service to handle business logic.
   * @param {Model<UserDocument>} userModel - The Mongoose model for User documents.
   * @param {Logger} logger - The logger instance for logging messages.
   */
  constructor(
    private readonly appService: AppService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Handles messages with the pattern 'get_users' to retrieve all users.
   * @returns {Promise<any>} A promise that resolves to an array of users.
   */
  @MessagePattern('get_users')
  async getUsers() {
    this.logger.info('Service A: Received request to get users');
    return await this.appService.getUsers();
  }

  /**
   * Handles messages with the pattern 'create_user' to create a new user.
   * @param {Object} userData - The data for the new user.
   * @param {string} userData.name - The name of the user.
   * @param {string} userData.email - The email of the user.
   * @param {number} [userData.age] - The optional age of the user.
   * @returns {Promise<any>} A promise that resolves to the created user.
   */
  @MessagePattern('create_user')
  async createUser(
    @Body() userData: { name: string; email: string; age?: number },
  ) {
    this.logger.info(
      `Service A: Received request to create user - ${userData.name}`,
    );
    return await this.appService.createUser(userData);
  }
}
