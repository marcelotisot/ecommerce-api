import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe,
  Query
} from '@nestjs/common';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('all')
  findAllCategories(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAllCategories(paginationDto);
  }

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('find/:id')
  findCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findCategoryById(id);
  }

  @Patch('update/:id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete('delete/:id')
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
