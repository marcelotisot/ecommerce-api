import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities/product.entity';
import { CategoriesService } from '@modules/categories/services/categories.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginationResponse } from '@common/interfaces/pagination-response.interface';
import { Category } from '@modules/categories/entities/category.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    
    const { categoryId, ...rest } = createProductDto;

    const category = await this.categoriesService.findCategoryById(categoryId);

    const product = this.productRepository.create({
      ...rest,
      category
    });

    const savedProduct = await this.productRepository.save(product);

    return savedProduct;

  }

  async findAllProducts(paginationDto: PaginationDto): Promise<PaginationResponse<Product>> {

    const { limit = 10, page = 1 } = paginationDto;

    const [products, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: products,
      total: total,
      per_page: limit,
      current_page: page,
      last_page: Math.ceil(total / limit),
    };
    
  }

  async findProductById(id: string): Promise<Product> {

    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;

  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
   
    const { categoryId,  ...rest } = updateProductDto;

    let category: Category | null = null;

    // Solo si el DTO incluye categoryId, se intenta buscar la nueva categoría
    if (categoryId !== undefined) {

      category = await this.categoriesService.findCategoryById(categoryId);

    }

    const product = await this.productRepository.preload({
      id,
      ...rest,

      // Si category está definida, se incluye. Si no, no cambia.
      ...(category ? { category } : {}),
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Guardar los cambios
    return this.productRepository.save(product);

  }

  async deleteProduct(id: string): Promise<Product> {

    const product = await this.findProductById(id);

    await this.productRepository.softRemove(product);

    return product;

  }

}
