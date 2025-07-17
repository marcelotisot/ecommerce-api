import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { mockCategoriesService } from '../__mocks__';

describe('CategoriesController', () => {

  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service    = module.get<CategoriesService>(CategoriesService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.createCategory with correct data', async () => {

    const dto: CreateCategoryDto = { name: 'Books' };

    const result = { 
      id: 'uuid', 
      name: 'Books', 
      slug: 'books' 
    };

    mockCategoriesService.createCategory.mockResolvedValue(result);

    expect(await controller.createCategory(dto)).toEqual(result);
    expect(service.createCategory).toHaveBeenCalledWith(dto);

  });

  it('should return paginated categories', async () => {

    const dto: PaginationDto = { limit: 10, page: 1 };

    const result = [{ id: '1', name: 'Category1' }];

    mockCategoriesService.findAllCategories.mockResolvedValue(result);

    expect(await controller.findAllCategories(dto)).toEqual(result);
    expect(service.findAllCategories).toHaveBeenCalledWith(dto);

  });

  it('should return a category by id', async () => {

    const id = 'uuid-123';

    const result = { id, name: 'Toys' };

    mockCategoriesService.findCategoryById.mockResolvedValue(result);

    expect(await controller.findCategoryById(id)).toEqual(result);
    expect(service.findCategoryById).toHaveBeenCalledWith(id);

  });

  it('should update and return updated category', async () => {

    const id = 'uuid-123';

    const dto: UpdateCategoryDto = { name: 'New Name' };

    const result = { id, name: 'New Name' };

    mockCategoriesService.updateCategory.mockResolvedValue(result);

    expect(await controller.updateCategory(id, dto)).toEqual(result);
    expect(service.updateCategory).toHaveBeenCalledWith(id, dto);

  });

  it('should call deleteCategory with correct id', async () => {

    const id = 'uuid-123';

    const result = { deleted: true };

    mockCategoriesService.deleteCategory.mockResolvedValue(result);

    expect(await controller.deleteCategory(id)).toEqual(result);
    expect(service.deleteCategory).toHaveBeenCalledWith(id);

  });

});