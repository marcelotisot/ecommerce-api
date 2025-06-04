import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { CategoriesService } from '../../../modules/categories/services/categories.service';
import { Product } from '../entities/product.entity';
import { Category } from '../../../modules/categories/entities/category.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { PaginationDto } from '../../../common';

// Mocks
import { 
  mockPaginatedProducts, 
  mockProduct, 
  mockProductRepository 
} from '../__mocks__/products';

import { 
  mockCategory, 
  mockCategoryRepository 
} from '../../../modules/categories/__mocks__/categories';

describe('ProductsService', () => {

  let service: ProductsService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: CategoriesService,
          useValue: {
            // Mockeamos findOne para que encuentre una categoria al crear el producto
            findOne: jest.fn().mockResolvedValue(mockCategory)
          }
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.resetAllMocks(); // Resetear todos los mocks antes de cada test

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

   /**
   * Test create()
   */
  it('should create product', async () => {

    const dto: CreateProductDto = {
      name: 'Test product',
      price: 10.00,
      stock: 100,
      categoryId: '0fedbefb-48cb-458f-9e6f-9cc171bf2ff4'
    };

    mockProductRepository.save?.mockResolvedValue(mockProduct);

    const result = await service.create(dto);

    expect(result).toEqual(mockProduct);

    expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
    expect(mockProductRepository.save).toHaveBeenCalled();

  });

  /**
   * Test findAll()
   */
  it('should return paginated products', async () => {

    const dto: PaginationDto = { page: 1, limit: 10 };

    const total = 3; // Se ajusta para que coincida con el total de mockPaginatedProducts

    // Simulamos lo que devolvería findAndCount
    mockProductRepository.findAndCount?.mockResolvedValue([mockPaginatedProducts, total]);
    
    jest.spyOn(service, 'findAll');

    const result = await service.findAll(dto);

    expect(mockProductRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: {
        createdAt: 'DESC'
      }
    });

    expect(result).toEqual({
      data: mockPaginatedProducts,
      meta: {
        total: 3,
        per_page:10,
        current_page: 1,
        last_page: 1
      }
    });

    expect(mockProductRepository.findAndCount).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(dto);

  });


  /**
   * Test findOne()
   */
  describe('findOne()', () => {

    it('should return product when found', async () => {

      const id = mockProduct.id;

      mockProductRepository.findOneBy?.mockResolvedValue(mockProduct);

      const result = await service.findOne(id);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ id });

    });

    it('should throw NotFoundException when product not found', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      // Mockeamos findOneBy() para que retorne null y lance la exception
      mockProductRepository.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ id });

    });

  });

  /**
   * Test update()
   */
  describe('update()', () => {

    it('should update and return the product if found', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      const dto: UpdateProductDto = { name: 'Updated Product' };

      // Simulamos el resultado
      const preloadResult = {
        id,
        ...dto
      };

      mockProductRepository.preload?.mockResolvedValue(preloadResult);
      mockProductRepository.save?.mockResolvedValue(preloadResult);

      const result = await service.update(id, dto);

      expect(mockProductRepository.preload).toHaveBeenCalledWith({ id, ...dto });
      expect(mockProductRepository.save).toHaveBeenCalledWith(preloadResult);

      expect(result).toEqual(preloadResult);

    });

    it('should throw NotFoundException if product does not exist', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      const dto: UpdateProductDto = { name: 'Updated Product' };

      // Mockeamos preload() para que retorne null y lance la exception
      mockProductRepository.preload?.mockResolvedValue(null);

      // Evaluamos la respuesta con el error
      await expect(service.update(id, dto)).rejects.toThrow(
        new NotFoundException(`Product with id ${id} not found`)
      );

      // Evaluamos que llame correctamente a preload() con el id y DTO
      expect(mockProductRepository.preload).toHaveBeenCalledWith({ id, ...dto });

      // Si se lanza la exception save() no deberia ser llamado
      expect(mockProductRepository.save).not.toHaveBeenCalled();

    });

  });

  /**
   * Test remove()
   */
  describe('remove()', () => {

     it('should soft remove a product and return success response', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      // Mock de findOne dentro del propio servicio
      service.findOne = jest.fn().mockResolvedValue(mockProduct);

      mockProductRepository.softRemove?.mockResolvedValue(mockProduct);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);

      // Evaluamos que softRemove se invoca con la entidad correcta
      expect(mockProductRepository.softRemove).toHaveBeenCalledWith(mockProduct);

      expect(result).toEqual({ message: 'Product deleted' });

    });

     it('should throw NotFoundException if product does not exist', async () => {
    
      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      service.findOne = jest.fn().mockRejectedValue(new NotFoundException);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);

      expect(mockProductRepository.softRemove).not.toHaveBeenCalled();

    });

  });

});
