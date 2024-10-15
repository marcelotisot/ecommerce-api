import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modulos
import { CategoriesModule } from './categories/categories.module';

// Entidades
import { Category } from './categories/entities/category.entity';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot(),

    // Conexion DB
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [ Category ],
      synchronize: true,
      retryAttempts: 3,
    }),

    CategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
