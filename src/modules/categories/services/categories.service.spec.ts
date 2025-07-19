import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

describe('CategoriesService', () => {

  let service: CategoriesService;
  let repository: jest.Mocked<Repository<Category>>;

  const mockCategory = {
    id: 'uuid-1',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Category;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        }
      ],
    }).compile();

    service    = module.get<CategoriesService>(CategoriesService);
    repository = module.get(getRepositoryToken(Category));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return a category', async () => {

    repository.create.mockReturnValue(mockCategory);
    repository.save.mockResolvedValue(mockCategory);

    const result = await service.createCategory({ name: 'Books' });

    expect(result).toEqual(mockCategory);
    expect(repository.create).toHaveBeenCalledWith({ name: 'Books' });
    expect(repository.save).toHaveBeenCalledWith(mockCategory);

  });

  it('should return paginated result', async () => {

    repository.findAndCount.mockResolvedValue([[mockCategory], 1]);

    const result = await service.findAllCategories({ limit: 10, page: 1 });

    expect(result.data).toEqual([mockCategory]);
    expect(result.total).toBe(1);

  });

  describe('findCategoryById', () => {

    it('should return a category by id', async () => {

      repository.findOneBy.mockResolvedValue(mockCategory);

      const result = await service.findCategoryById('uuid-1');

      expect(result).toEqual(mockCategory);

    });

    it('should throw NotFoundException if category not found', async () => {

      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findCategoryById('bad-id')).rejects.toThrow(NotFoundException);

    });

  });

  describe('updateCategory', () => {

    it('should update and return category', async () => {

      const updated = { ...mockCategory, name: 'Updated' };

      repository.preload.mockResolvedValue(updated as Category);
      repository.save.mockResolvedValue(updated as Category);

      const result = await service.updateCategory('uuid-1', { name: 'Updated' });

      expect(result.name).toBe('Updated');
      expect(repository.preload).toHaveBeenCalledWith({ id: 'uuid-1', name: 'Updated' });

    });

    it('should throw NotFoundException if category not found for update', async () => {

      repository.preload.mockResolvedValue(undefined);

      await expect(service.updateCategory('bad-id', { name: 'x' })).rejects.toThrow(NotFoundException);

    });

  });

  it('should soft delete category', async () => {

    repository.findOneBy.mockResolvedValue(mockCategory);
    repository.softRemove.mockResolvedValue(mockCategory);

    const result = await service.deleteCategory('uuid-1');

    expect(result).toEqual(mockCategory);
    expect(repository.softRemove).toHaveBeenCalledWith(mockCategory);
    
  });

});
