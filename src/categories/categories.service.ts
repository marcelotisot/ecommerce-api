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
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoriesService {

  private readonly logger = new Logger('CategoriesService');
  
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  findAllCategories(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    return this.categoryRepository.find({
      take: limit,
      skip: offset,

      where: { deleted: false }
    });
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {

    try {

      const category = this.categoryRepository.create({
        name: createCategoryDto.name.toLowerCase().trim(),
        slug: slugify(createCategoryDto.name, '_').toLowerCase()
      });
  
      await this.categoryRepository.save(category);

      return category;
     
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async findCategoryById(id: string) {
    const category = await this.categoryRepository.findOneBy({id});

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {

    updateCategoryDto.name = updateCategoryDto.name.toLowerCase().trim();

    // Buscar categoria y cargar las propiedades de updateCategoryDto
    const category = await this.categoryRepository.preload({
      id: id,
      ...updateCategoryDto
    });

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    // Generar nuevo slug
    category.slug = slugify(updateCategoryDto.name, '_').toLowerCase()

    return this.categoryRepository.save(category);
      
  }

  async deleteCategory(id: string) {
    const category = await this.findCategoryById(id);
    category.deleted = true;
    await this.categoryRepository.save(category);
  }

  /*
  * Eliminar todos los registros
  * -------------------------------------------------
  * Se va a usar para vaciar la tabla antes de insertar
  * datos de prueba con el seeder
  */
  async deleteAllCategories() {
    const query = this.categoryRepository.createQueryBuilder('category');

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
