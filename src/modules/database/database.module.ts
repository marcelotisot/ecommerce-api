import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Variables de entorno
import { envs } from '../../config';

// Entidades
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    // Conexion a postgress
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
      entities: [Category, Product],
      synchronize: true,
      retryAttempts: 3
    }),
  ]
})
export class DatabaseModule {}
