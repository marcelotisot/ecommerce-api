import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from '@config/envs';
import { Category } from '@modules/categories/entities/category.entity';
import { Product } from '@modules/products/entities/product.entity';
import { User } from '@modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      entities: [Category, Product, User],
      synchronize: true,

      // Solo aplica dropSchema en true si NODE_ENV === 'test
      dropSchema: process.env.NODE_ENV === 'test', // elimina todas las tablas antes de cada suite de test
    })
  ]
})
export class DatabaseModule {}
