import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

/**
 * Configure the Winston logger for the application.
 * The logger is set to log messages at the 'info' level and above.
 * It formats logs with timestamps and outputs them to specified files.
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
 * The AppModule class is the root module of the NestJS application.
 * It imports necessary modules, registers controllers, and provides services.
 */
@Module({
  imports: [
    /**
     * Register microservice clients for inter-service communication.
     * SERVICE_A and SERVICE_B are configured to use TCP transport.
     */
    ClientsModule.register([
      {
        name: 'SERVICE_A',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4000,
        },
      },
      {
        name: 'SERVICE_B',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4001,
        },
      },
    ]),
    logger, // Integrate the configured logger into the application
  ],
  controllers: [AppController], // Register the AppController
  providers: [AppService], // Provide the AppService for dependency injection
})
export class AppModule {}
