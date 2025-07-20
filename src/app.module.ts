import { Module } from '@nestjs/common';

// Modulos
import { DatabaseModule } from '@modules/database/database.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { ProductsModule } from '@modules/products/products.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule, 
    CategoriesModule, 
    ProductsModule, UsersModule
  ]
})
export class AppModule {}
