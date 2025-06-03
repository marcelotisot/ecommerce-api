import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { CategoriesService } from '../../../modules/categories/services/categories.service';
import { Product } from '../entities/product.entity';
import { Category } from '../../../modules/categories/entities/category.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
