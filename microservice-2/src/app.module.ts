import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
// import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

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
    // ClientsModule.register([
    //   {
    //     name: 'SERVICE_A',
    //     transport: Transport.TCP,
    //     options: {
    //       host: '127.0.0.1',
    //       port: 4001,
    //     },
    //   },
    // ]),
    // RabbitmqModule,
    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   exchanges: [
    //     {
    //       name: 'amq.direct',
    //       type: 'direct',
    //     },
    //   ],
    //   uri: `${process.env.URI_RABBITMQ_LOCAL}`,
    //   enableControllerDiscovery: true,
    // }),
    logger,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
