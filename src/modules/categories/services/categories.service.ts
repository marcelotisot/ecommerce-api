import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginationResponse } from '@common/interfaces/pagination-response.interface';

@Injectable()
export class CategoriesService {
  
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {

    const category = this.categoryRepository.create(createCategoryDto);

    await this.categoryRepository.save(category);

    return category;

  }

  async findAllCategories(paginationDto: PaginationDto): Promise<PaginationResponse<Category>> {

    const { limit = 10, page = 1 } = paginationDto;

    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: categories,
      total: total,
      per_page: limit,
      current_page: page,
      last_page: Math.ceil(total / limit),
    };

  }

  async findCategoryById(id: string): Promise<Category> {
    
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;

  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return this.categoryRepository.save(category);

  }

  async deleteCategory(id: string): Promise<Category> {
    
    const category = await this.findCategoryById(id);

    await this.categoryRepository.softRemove(category);

    return category;

  }

}
