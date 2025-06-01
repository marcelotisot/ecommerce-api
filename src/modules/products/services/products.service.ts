import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../../modules/categories/services/categories.service';
import { PaginatedResult, PaginationDto } from '../../../common';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoriesService.findOne(createProductDto.categoryId);

    const product = this.productRepository.create({
      ...createProductDto,
      category
    });

    return this.productRepository.save(product); 
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Product>> {
    
    const { page = 1, limit = 10} = paginationDto;
    
    const skip = ( page - 1 ) * limit;

    const [products, total] = await this.productRepository.findAndCount({

      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
      
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: products,

      meta: {
        total: total,
        per_page: Number(limit),
        current_page: Number(page),
        last_page: lastPage
      }
    }

  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if(updateProductDto.categoryId) {

      const category = await this.categoriesService.findOne(
        updateProductDto.categoryId
      
      );
      product.category = category;

    }
    
    return this.productRepository.save(product);

  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);

    await this.productRepository.softRemove(product);

    return { message: 'Product deleted' };
  }
}
