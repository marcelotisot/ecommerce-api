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

import { ProductsService } from '../services/products.service';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Auth } from '@modules/auth/decorators';
import { ValidRoles } from '@modules/auth/interfaces';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Auth(ValidRoles.admin)
  @Post('create')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get('all')
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAllProducts(paginationDto);
  }

  @Get(':id')
  findProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findProductById(id);
  }

  @Auth(ValidRoles.admin)
  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Auth(ValidRoles.admin)
  @Delete('delete/:id')
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }

}
