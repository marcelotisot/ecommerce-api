import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { CartsModule } from '../carts/carts.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CartsModule,
  ],
})
export class SeedModule {}
