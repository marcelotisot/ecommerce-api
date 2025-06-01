import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from '../../config';

import { Category } from '../categories/entities/category.entity';

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
      entities: [Category],
      synchronize: true,
      retryAttempts: 3
    }),
  ]
})
export class DatabaseModule {}
