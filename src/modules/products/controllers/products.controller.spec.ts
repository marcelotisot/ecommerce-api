import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../../../modules/categories/services/categories.service';
import { Product } from '../entities/product.entity';
import { Category } from '../../../modules/categories/entities/category.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';

// Mocks
import { 
  mockPaginatedProducts,
  mockProduct, 
  mockProductsService 
} from '../__mocks__';

import { mockCategoriesService } from '../../../modules/categories/__mocks__';

import { PaginationDto } from '../../../common';

describe('ProductsController', () => {

  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [  
        {
          provide: ProductsService,
          useValue: mockProductsService
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService
        },
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

  it('should call service create method with valid dto and return created product', async () => {

    const dto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test description',
      price: 12.00,
      stock: 100,
      categoryId: '92670564-f5fe-4df3-9941-b1c261fad089'
    };

    jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

    const result = await controller.create(dto);

    expect(result).toEqual(mockProduct);
    expect(service.create).toHaveBeenCalledWith(dto);

  });

  it('should call service findAll method with paginationDto and return paginated categories', async () => {

    const dto: PaginationDto = { page: 1, limit: 10 };

    jest.spyOn(service, 'findAll').mockResolvedValue(mockPaginatedProducts);

    const result = await controller.findAll(dto);

    expect(result).toEqual(mockPaginatedProducts);
    expect(service.findAll).toHaveBeenCalledWith(dto);

  });

  it('should return product by id', async () => {

    const id = mockProduct.id;

    jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

    const result = await controller.findOne(id);

    expect(result).toEqual(mockProduct);
    expect(service.findOne).toHaveBeenCalledWith(id);

  });

  it('should update product', async () => {

    const id = mockProduct.id;

    const dto: UpdateProductDto = {
      name: 'Product updated name',
      price: 10.00,
      stock: 50
    };

    const updatedProduct = { id, ...dto };

    jest.spyOn(service, 'update').mockResolvedValue(updatedProduct as Product);

    const result = await controller.update(id, dto);

    expect(service.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(updatedProduct);

  });

  it('should delete product and return success message', async () => {

    const id = mockProduct.id;

    // Llamamos al método y simulamos el comportamiento
    jest.spyOn(service, 'remove').mockImplementation(async (_id) => {
      return { message: 'Product deleted' };
    });

    const result = await controller.remove(id);

    expect(service.remove).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: 'Product deleted' });

  });

});
