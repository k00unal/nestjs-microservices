import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * The bootstrap function initializes the NestJS application.
 * It creates an instance of the application using the AppModule
 * and starts listening for incoming requests on port 3002.
 */
async function bootstrap() {
  // Create a NestJS application instance using the AppModule
  const app = await NestFactory.create(AppModule);

  // Start the application and listen for incoming requests on port 3002
  await app.listen(3002);
}

// Call the bootstrap function to start the application
bootstrap();
