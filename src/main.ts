import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo deja enviar la data que se esta esperando
      forbidNonWhitelisted: true, // Validar que solo lleguen las propiedades esperadas

      // Transformar la informacion que fluya sobre los DTOS
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.setGlobalPrefix('api/v1');
  
  await app.listen(process.env.PORT);

  logger.log(`App running on port: ${process.env.PORT}`);

}
bootstrap();
