import { Body, Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';

import { MessagePattern } from '@nestjs/microservices';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @MessagePattern('get_users')
  async getUsers() {
    this.logger.info('Service A: Received request to get users');
    return await this.appService.getUsers();
  }

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
