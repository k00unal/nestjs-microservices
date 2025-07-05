import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

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
