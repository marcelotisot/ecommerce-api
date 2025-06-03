import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../../../modules/categories/services/categories.service';
import { Product } from '../entities/product.entity';
import { Category } from '../../../modules/categories/entities/category.entity';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
