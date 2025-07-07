import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

/**
 * The bootstrap function initializes the microservice application.
 */
async function bootstrap() {
  /**
   * Creates a microservice using the AppModule and configures it to use TCP transport.
   */
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1' /** The host address for the microservice. */,
      port: 4000 /** The port on which the microservice will listen. */,
    },
  });

  /**
   * Starts listening for incoming requests.
   */
  await app.listen();
  console.log('Microservice is listening on TCP port 4000');
}

/**
 * Calls the bootstrap function to start the application.
 */
bootstrap();
