import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { DatabaseModule } from '@modules/database/database.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { ProductsModule } from '@modules/products/products.module';

describe('AppModule', () => {
  let module: TestingModule;
  let databaseModule: DatabaseModule;
  let categoriesModule: CategoriesModule;
  let productsModule: ProductsModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    databaseModule   = module.get<DatabaseModule>(DatabaseModule);
    categoriesModule = module.get<CategoriesModule>(CategoriesModule);
    productsModule   = module.get<ProductsModule>(ProductsModule);
  });

  it('should be defined with proper elements', () => {

    expect(module).toBeDefined();
    expect(databaseModule).toBeDefined();
    expect(categoriesModule).toBeDefined();
    expect(productsModule).toBeDefined();
    
  });

});