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

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAll() {
    return this.productRepo.find({
      relations: { category: true },
      where: { deleted: false }
    });
  }

  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepo.create({
        title: createProductDto.title,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
      });

      product.slug = slugify(createProductDto.title.trim(), '_').toLowerCase();

      if ( createProductDto.categoryId ) {
        const category = await this.categoriesService.findOne(
          createProductDto.categoryId
        );

        product.category = category;
      }

      await this.productRepo.save(product);

      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOneBy({id});
    
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    

    const product = await this.productRepo.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) 
      throw new NotFoundException(`Product with id ${id} not found`);

    
    if ( updateProductDto.title )
      product.slug = slugify(updateProductDto.title.trim(), '_').toLowerCase();

    if ( updateProductDto.categoryId ) {
      const category = await this.categoriesService.findOne(
        updateProductDto.categoryId
      );

      product.category = category;
    }
    
    return this.productRepo.save(product);


  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.deleted = true;
    await this.productRepo.save(product);
  }

  // Manejo de errores
  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error');
  }
}
