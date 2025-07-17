import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from '@config/envs';
import { Category } from '@modules/categories/entities/category.entity';
import { Product } from '@modules/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      entities: [Category, Product],
      synchronize: true,
    })
  ]
})
export class DatabaseModule {}
