import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { TypeORMExceptionFilter } from './common';

export async function bootstrap() {
  const logger = new Logger('Main bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new TypeORMExceptionFilter());

  await app.listen(envs.port );

  logger.log(`Server running on port ${envs.port}`);
}
bootstrap();
