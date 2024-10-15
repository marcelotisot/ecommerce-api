import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modulos
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';

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
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 3,
    }),

    CategoriesModule,

    ProductsModule,

    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
