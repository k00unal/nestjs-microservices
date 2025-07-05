import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

const logger = WinstonModule.forRoot({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/microservices-1-db'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    logger,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
