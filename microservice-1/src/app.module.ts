import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

/**
 * Configures the Winston logger with specified settings.
 */
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

/**
 * The AppModule class is the root module of the application.
 * It imports necessary modules, controllers, and providers.
 */
@Module({
  imports: [
    /**
     * Connects to the MongoDB database for the application.
     */
    MongooseModule.forRoot('mongodb://localhost:27017/microservices-1-db'),

    /**
     * Defines the Mongoose feature module for the User schema.
     */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    /**
     * Integrates the configured logger into the application.
     */
    logger,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
