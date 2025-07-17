import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from '@config/envs';
import { TypeOrmExceptionFilter } from '@common/filters/typeorm-exception.filter';

const logger = new Logger('Main-Bootstrap');

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  app.useGlobalFilters(new TypeOrmExceptionFilter);

  await app.listen(envs.port);

  logger.log(`Ecommerce API running on port ${envs.port}`);

}
bootstrap();
