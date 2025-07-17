import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe 
} from '@nestjs/common';

import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('all')
  findAllCategories(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAllCategories(paginationDto);
  }

  @Get(':id')
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
