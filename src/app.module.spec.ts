import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { DatabaseModule } from '@modules/database/database.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { ProductsModule } from '@modules/products/products.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';

describe('AppModule', () => {
  let module: TestingModule;
  let databaseModule: DatabaseModule;
  let categoriesModule: CategoriesModule;
  let productsModule: ProductsModule;
  let usersModule: UsersModule;
  let authModule: AuthModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    databaseModule   = module.get<DatabaseModule>(DatabaseModule);
    categoriesModule = module.get<CategoriesModule>(CategoriesModule);
    productsModule   = module.get<ProductsModule>(ProductsModule);
    usersModule      = module.get<UsersModule>(UsersModule);
    authModule       = module.get<AuthModule>(AuthModule);
  });

  it('should be defined with proper elements', () => {

    expect(module).toBeDefined();
    expect(databaseModule).toBeDefined();
    expect(categoriesModule).toBeDefined();
    expect(productsModule).toBeDefined();
    expect(usersModule).toBeDefined();
    expect(authModule).toBeDefined();

  });

});