import { Module } from '@nestjs/common';

// Modulos
import { DatabaseModule } from './modules/database/database.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartsModule } from './modules/carts/carts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    DatabaseModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    CartsModule,
    OrdersModule,
    PaymentsModule
  ]
})
export class AppModule {}
