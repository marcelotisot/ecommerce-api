import { Module } from '@nestjs/common';

// Modulos
import { DatabaseModule } from '@modules/database/database.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { ProductsModule } from '@modules/products/products.module';

@Module({
  imports: [
    DatabaseModule, 
    CategoriesModule, 
    ProductsModule
  ]
})
export class AppModule {}
