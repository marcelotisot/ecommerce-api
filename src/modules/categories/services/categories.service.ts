import { 
  HttpStatus, 
  Injectable, 
  NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category } from '../entities/category.entity';
import { PaginatedResult, PaginationDto } from '../../../common';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {

    const category = this.repository.create(createCategoryDto);

    return this.repository.save(category);

  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Category>> {

    // Paginacion
    const { page = 1, limit = 10} = paginationDto;
    
    const skip = ( page - 1 ) * limit;

    const [categories, total] = await this.repository.findAndCount({

      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
      
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: categories,

      meta: {
        total: total,
        per_page: Number(limit),
        current_page: Number(page),
        last_page: lastPage
      }
    }

  }

  async findOne(id: string): Promise<Category> {

    const category = await this.repository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;

  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

    // Construir una nueva entidad con los cambios
    const category = await this.repository.preload({
      id,
      ...updateCategoryDto
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return this.repository.save(category);

  }

  async remove(id: string): Promise<{ message: string }> {

    const category = await this.findOne(id);

    await this.repository.softRemove(category);

    return { message: 'Category deleted' };

  }
  
}
