import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * The AppService class provides methods to interact with the user data.
 */
@Injectable()
export class AppService {
  /**
   * Constructs an instance of AppService.
   * @param {Model<User>} userModel - The Mongoose model for User documents.
   * @param {Logger} logger - The logger instance for logging messages.
   */
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} A promise that resolves to an array of users.
   */
  async getUsers(): Promise<User[]> {
    this.logger.info('Service A: Fetching all users from database');
    try {
      const users = await this.userModel.find().exec();
      this.logger.info(
        `Service A: Successfully fetched ${users.length} users from database`,
      );
      return users;
    } catch (error) {
      this.logger.error(
        `Service A: Error fetching users from database - ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Creates a new user in the database.
   * @param {Object} userData - The data for the new user.
   * @param {string} userData.name - The name of the user.
   * @param {string} userData.email - The email of the user.
   * @param {number} [userData.age] - The optional age of the user.
   * @returns {Promise<User>} A promise that resolves to the created user.
   */
  async createUser(userData: {
    name: string;
    email: string;
    age?: number;
  }): Promise<User> {
    this.logger.info(
      `Service A: Creating new user - ${userData.name} (${userData.email})`,
    );
    try {
      const user = new this.userModel(userData);
      const savedUser = await user.save();
      this.logger.info(
        `Service A: Successfully created user - ${userData.name} with ID ${savedUser._id}`,
      );
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Service A: Error creating user ${userData.name} - ${error.message}`,
      );
      throw error;
    }
  }
}
