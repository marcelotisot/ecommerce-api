import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { CategoriesService } from '@modules/categories/services/categories.service';
import { Category } from '@modules/categories/entities/category.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';

// Mocks
import { mockRepository } from '../../../../test/__mocks__/mock.repository';

describe('ProductsService', () => {

  let service: ProductsService;
  let productRepo: jest.Mocked<Repository<Product>>;
  let categoriesService: jest.Mocked<CategoriesService>;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: CategoriesService,
          useValue: { findCategoryById: jest.fn() },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {}
        }
      ],
    }).compile();

    service           = module.get<ProductsService>(ProductsService);
    productRepo       = module.get(getRepositoryToken(Product));
    categoriesService = module.get(CategoriesService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return a product', async () => {

    const dto: CreateProductDto = {
      title: 'Test Product',
      price: 100,
      sizes: ['XL', 'L'],
      gender: 'men',
      categoryId: 'cat123',
    };

    const category: Category = { id: 'cat123', name: 'Test Category' } as Category;

    const productEntity: Product = {
      title: 'Test Product',
      price: 100,
      sizes: ['XL', 'L'],
      gender: 'men',
      category,
    } as Product;

    const savedProduct: Product = {
      id: 'prod1',
      title: 'Test Product',
      price: 100,
      sizes: ['XL', 'L'],
      gender: 'men',
      category,
    } as Product;

    categoriesService.findCategoryById.mockResolvedValue(category);
    productRepo.create.mockReturnValue(productEntity);
    productRepo.save.mockResolvedValue(savedProduct);

    const result = await service.createProduct(dto);

    expect(categoriesService.findCategoryById).toHaveBeenCalledWith('cat123');

    expect(productRepo.create).toHaveBeenCalledWith({
      title: 'Test Product',
      price: 100,
      sizes: ['XL', 'L'],
      gender: 'men',
      category: category,
    });

    expect(productRepo.save).toHaveBeenCalledWith(productEntity);
    expect(result).toEqual(savedProduct);

  });

  describe('findProductById()', () => {

    it('should return a product by id', async () => {

      const product: Product = { 
        id: 'prod1', 
        title: 'Product', 
        price: 50 
      } as Product;

      productRepo.findOneBy.mockResolvedValue(product);

      const result = await service.findProductById('prod1');

      expect(result).toEqual(product);

    });

    it('should throw NotFoundException if product not found', async () => {

      productRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findProductById('notfound')).rejects.toThrow(NotFoundException);

    });

  }); // findProductById

  describe('updateProduct()', () => {

    it('should update a product', async () => {

      const dto: UpdateProductDto = {
        title: 'Updated',
        categoryId: 'cat456',
      };

      const category = { id: 'cat456', name: 'Cat' } as Category;
      const updated = { id: 'prod1', title: 'Updated', category } as Product;

      categoriesService.findCategoryById.mockResolvedValue(category);
      productRepo.preload.mockResolvedValue(updated);
      productRepo.save.mockResolvedValue(updated);

      const result = await service.updateProduct('prod1', dto);

      expect(categoriesService.findCategoryById).toHaveBeenCalledWith('cat456');

      expect(productRepo.preload).toHaveBeenCalledWith({
        id: 'prod1',
        title: 'Updated',
        category,
      });

      expect(result).toEqual(updated);

    });

    it('should throw NotFoundException if product to update not found', async () => {

      productRepo.preload.mockResolvedValue(undefined);

      await expect(service.updateProduct('missing', {})).rejects.toThrow(NotFoundException);

    });


  }); // updateProduct

  it('should return paginated products', async () => {

    const products: Product[] = [
      { id: '1', title: 'P1', price: 10 } as Product,
      { id: '2', title: 'P2', price: 20 } as Product,
    ];

    productRepo.findAndCount.mockResolvedValue([products, 2]);

    const result = await service.findAllProducts({ limit: 2, page: 1 });

    expect(result).toEqual({
      data: products,
      total: 2,
      per_page: 2,
      current_page: 1,
      last_page: 1,
    });

  });

  it('should soft delete a product', async () => {

    const product = { id: 'prod1' } as Product;

    jest.spyOn(service, 'findProductById').mockResolvedValue(product);
    productRepo.softRemove.mockResolvedValue(product);

    const result = await service.deleteProduct('prod1');

    expect(service.findProductById).toHaveBeenCalledWith('prod1');
    expect(productRepo.softRemove).toHaveBeenCalledWith(product);
    expect(result).toEqual(product);

  });
 
});
