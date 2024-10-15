import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [ TypeOrmModule.forFeature([ Category ]) ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [
    CategoriesService, 

    /*
    * Exportamos para poder repositoro
    * fuera del modulo
    */
    TypeOrmModule 
  ],
})
export class CategoriesModule {}
