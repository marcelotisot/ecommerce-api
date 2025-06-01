import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';

// Mocks
import { 
  mockCategory, 
  mockCategoryRepository, 
  mockPaginatedCategories
} from '../__mocks__';

import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { PaginationDto } from '../../../common';

describe('CategoriesService', () => {

  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository
        }
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);

    jest.resetAllMocks(); // Resetear todos los mocks antes de cada test

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Test create()
   */
  it('should create category', async () => {

    const dto: CreateCategoryDto = { name: 'New Category' };

    mockCategoryRepository.save?.mockResolvedValue(mockCategory);

    const result = await service.create(dto);

    expect(result).toEqual(mockCategory);

    expect(mockCategoryRepository.create).toHaveBeenCalledWith(dto);
    expect(mockCategoryRepository.save).toHaveBeenCalled();

  });

  /**
   * Test findAll()
   */
  it('should return paginated categories', async () => {

    const dto: PaginationDto = { page: 1, limit: 10 };

    const total = 10;

    // Simulamos lo que devolvería findAndCount
    mockCategoryRepository.findAndCount?.mockResolvedValue([mockPaginatedCategories, total]);
    
    jest.spyOn(service, 'findAll');

    const result = await service.findAll(dto);

    expect(mockCategoryRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: {
        createdAt: 'DESC'
      }
    });

    expect(result).toEqual({
      data: mockPaginatedCategories,
      meta: {
        total: 10,
        per_page:10,
        current_page: 1,
        last_page: 1
      }
    });

    expect(mockCategoryRepository.findAndCount).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(dto);

  });

  /**
   * Test findOne()
   */
  describe('findOne()', () => {

    it('should return category when found', async () => {

      const id = mockCategory.id;

      mockCategoryRepository.findOneBy?.mockResolvedValue(mockCategory);

      const result = await service.findOne(id);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id });

    });

    it('should throw NotFoundException when category not found', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      // Mockeamos findOneBy() para que retorne null y lance la exception
      mockCategoryRepository.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

      expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id });

    });

  });

  /**
   * Test update()
   */
  describe('update()', () => {

    it('should update and return the category if found', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      const dto: UpdateCategoryDto = { name: 'Updated Category' };

      // Simulamos el resultado
      const preloadResult = {
        id,
        ...dto
      };

      mockCategoryRepository.preload?.mockResolvedValue(preloadResult);
      mockCategoryRepository.save?.mockResolvedValue(preloadResult);

      const result = await service.update(id, dto);

      expect(mockCategoryRepository.preload).toHaveBeenCalledWith({ id, ...dto });
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(preloadResult);

      expect(result).toEqual(preloadResult);

    });

    it('should throw NotFoundException if category does not exist', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      const dto: UpdateCategoryDto = { name: 'Updated Category' };

      // Mockeamos preload() para que retorne null y lance la exception
      mockCategoryRepository.preload?.mockResolvedValue(null);

      // Evaluamos la respuesta con el error
      await expect(service.update(id, dto)).rejects.toThrow(
        new NotFoundException(`Category with id ${id} not found`)
      );

      // Evaluamos que llame correctamente a preload() con el id y DTO
      expect(mockCategoryRepository.preload).toHaveBeenCalledWith({ id, ...dto });

      // Si se lanza la exception save() no deberia ser llamado
      expect(mockCategoryRepository.save).not.toHaveBeenCalled();

    });

  });

  /**
   * Test remove()
   */
  describe('remove()', () => {

    it('should soft remove a category and return success response', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      // Mock de findOne dentro del propio servicio
      service.findOne = jest.fn().mockResolvedValue(mockCategory);

      mockCategoryRepository.softRemove?.mockResolvedValue(mockCategory);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);

      // Evaluamos que softRemove se invoca con la entidad correcta
      expect(mockCategoryRepository.softRemove).toHaveBeenCalledWith(mockCategory);

      expect(result).toEqual({ message: 'Category deleted' });

    });

    it('should throw NotFoundException if category does not exist', async () => {
    
      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      service.findOne = jest.fn().mockRejectedValue(
        new NotFoundException('Category with id d31366de-3519-4feb-8e30-bb59636ed41d not found')
      );

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(mockCategoryRepository.softRemove).not.toHaveBeenCalled();

    });

  });

});
