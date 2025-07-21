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
import { Auth } from '@modules/auth/decorators';
import { ValidRoles } from '@modules/auth/interfaces';

@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Auth(ValidRoles.admin)
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

  @Auth(ValidRoles.admin)
  @Patch('update/:id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Auth(ValidRoles.admin)
  @Delete('delete/:id')
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.deleteCategory(id);
  }

}
