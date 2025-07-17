import { Module } from '@nestjs/common';

// Modulos
import { DatabaseModule } from '@modules/database/database.module';
import { CategoriesModule } from '@modules/categories/categories.module';

@Module({
  imports: [
    DatabaseModule, 
    CategoriesModule
  ]
})
export class AppModule {}
