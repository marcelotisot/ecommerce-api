import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsService } from './services/carts.service';
import { CartsController } from './controllers/carts.controller';
import { Cart, CartItem } from './entities';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    AuthModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
