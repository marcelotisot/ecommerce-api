import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {

  private readonly logger = new Logger('CategoriesService');
  
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ) {}

  findAll() {
    // TODO: Agregar paginacion
    return this.categoryRepo.find();
  }

  async create(createCategoryDto: CreateCategoryDto) {

    try {

      const category = this.categoryRepo.create({
        categoryName: createCategoryDto.categoryName.toLowerCase().trim(),
        categorySlug: slugify(createCategoryDto.categoryName, '_').toLowerCase()
      });
  
      await this.categoryRepo.save(category);

      return category;
     
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOneBy({id});

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    updateCategoryDto.categoryName = updateCategoryDto.categoryName.toLowerCase().trim();

    // Buscar categoria y cargar las propiedades de updateCategoryDto
    const category = await this.categoryRepo.preload({
      id: id,
      ...updateCategoryDto
    });

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    // Generar nuevo slug
    category.categorySlug = slugify(updateCategoryDto.categoryName, '_').toLowerCase()

    return this.categoryRepo.save(category);
      
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    category.deleted = true;
    await this.categoryRepo.save(category);
  }

  // Manejo de errores
  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error');
  }
}
