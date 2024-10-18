import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { CategoriesService } from '../categories/categories.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAllProducts(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC'},
      where: { deleted: false }
    });
  }

  async createProduct(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create({
        title: createProductDto.title,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
      });

      product.slug = slugify(createProductDto.title.trim(), '_').toLowerCase();

      if ( createProductDto.categoryId ) {
        const category = await this.categoriesService.findCategoryById(
          createProductDto.categoryId
        );

        product.category = category;
      }

      await this.productRepository.save(product);

      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findProductById(id: string) {
    const product = await this.productRepository.findOneBy({id});
    
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) 
      throw new NotFoundException(`Product with id ${id} not found`);

    
    if ( updateProductDto.title )
      product.slug = slugify(updateProductDto.title.trim(), '_').toLowerCase();

    if ( updateProductDto.categoryId ) {
      const category = await this.categoriesService.findCategoryById(
        updateProductDto.categoryId
      );

      product.category = category;
    }
    
    return this.productRepository.save(product);


  }

  async deleteProduct(id: string) {
    const product = await this.findProductById(id);
    product.deleted = true;
    await this.productRepository.save(product);
  }

  /*
  * Eliminar todos los registros
  * -------------------------------------------------
  * Se va a usar para vaciar la tabla antes de insertar
  * datos de prueba con el seeder
  */
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Manejo de errores
  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error');
  }
}
