import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { PaginationDto } from '../../../common';

// Mocks
import { 
  mockCategoriesService,
  mockCategory, 
  mockPaginatedCategories 
} from '../__mocks__/categories';

describe('CategoriesController', () => {

  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service create method with valid dto and return created category', async () => {

    const dto: CreateCategoryDto = { name: 'Test Category' };

    jest.spyOn(service, 'create').mockResolvedValue(mockCategory);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCategory);
    expect(service.create).toHaveBeenCalledWith(dto);

  });

  it('should call service findAll method with paginationDto and return paginated categories', async () => {

    const dto: PaginationDto = { page: 1, limit: 10 };

    jest.spyOn(service, 'findAll').mockResolvedValue(mockPaginatedCategories);

    const result = await controller.findAll(dto);

    expect(result).toEqual(mockPaginatedCategories);
    expect(service.findAll).toHaveBeenCalledWith(dto);

  });

  it('should return category by id', async () => {

    const id = mockCategory.id;

    jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);

    const result = await controller.findOne(id);

    expect(result).toEqual(mockCategory);
    expect(service.findOne).toHaveBeenCalledWith(id);

  });

  it('should update category', async () => {

    const id = mockCategory.id;

    const dto: UpdateCategoryDto = { name: 'Category Update' };

    const updatedCategory = { id, ...dto };

    jest.spyOn(service, 'update').mockResolvedValue(updatedCategory as Category);

    const result = await controller.update(id, dto);

    expect(service.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(updatedCategory);

  });

  it('should delete category and return success message', async () => {

    const id = mockCategory.id;

    // Llamamos al método y simulamos el comportamiento
    jest.spyOn(service, 'remove').mockImplementation(async (_id) => {
      return { message: 'Category deleted' };
    });

    const result = await controller.remove(id);

    expect(service.remove).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: 'Category deleted' });

  });

});
