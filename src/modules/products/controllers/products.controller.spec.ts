import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { CategoriesService } from '@modules/categories/services/categories.service';
import { Category } from '@modules/categories/entities/category.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { PaginationDto } from '@common/dto/pagination.dto';

describe('ProductsController', () => {

  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    createProduct: jest.fn(dto => ({ id: 'uuid123', ...dto })),
    findAllProducts: jest.fn(dto => ({ data: [], total: 0, ...dto })),
    findProductById: jest.fn(id => ({ id, name: 'Product 1' })),
    updateProduct: jest.fn((id, dto) => ({ id, ...dto })),
    deleteProduct: jest.fn(id => ({ deleted: true })),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt'
        }),
      ],
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        CategoriesService,
        {
          provide: getRepositoryToken(Product),
          useValue: {}
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service    = module.get<ProductsService>(ProductsService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {

    const dto: CreateProductDto = { 
      title: 'Test Product', 
      price: 100,
      sizes: ['XL', 'L', 'M'],
      gender: 'men',
      categoryId: 'category-uuid'
    };

    const result = await controller.createProduct(dto);

    expect(result).toEqual({
      id: 'uuid123',
      ...dto
    });

    expect(service.createProduct).toHaveBeenCalledWith(dto);

  });

  it('should get all products with pagination', async () => {

    const pagination: PaginationDto = { limit: 10, page: 1 };

    const result = await controller.findAllProducts(pagination);

    expect(result).toEqual({ data: [], total: 0, limit: 10, page: 1 });
    expect(service.findAllProducts).toHaveBeenCalledWith(pagination);

  });

  it('should find a product by id', async () => {

    const id = 'uuid-1';
    const result = await controller.findProductById(id);
    
    expect(result).toEqual({ id: 'uuid-1', name: 'Product 1' });
    expect(service.findProductById).toHaveBeenCalledWith(id);

  });

  it('should update a product', async () => {

    const id = 'uuid-2';

    const dto: UpdateProductDto = { title: 'Updated Product', price: 150 };

    const result = await controller.update(id, dto);

    expect(result).toEqual({ id: 'uuid-2', ...dto});

    expect(service.updateProduct).toHaveBeenCalledWith(id, dto);

  });

  it('should delete a product', async () => {

    const id = 'uuid-3';
    
    const result = await controller.deleteProduct(id);

    expect(result).toEqual({ deleted: true });

    expect(service.deleteProduct).toHaveBeenCalledWith(id);

  });

});
