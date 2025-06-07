import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { CategoriesModule } from '../categories/categories.module';
import { Product ,ProductImage } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]), 
    CategoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
