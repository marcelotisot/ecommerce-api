import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

const logger = new Logger('Main-Bootstrap');

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  await app.listen(envs.port);

  logger.log(`Ecommerce API running on port ${envs.port}`);

}
bootstrap();
