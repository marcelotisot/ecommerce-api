jest.setTimeout(10000); // Aumenta el timeout global a 10 segundos

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { CreateProductDto } from '@modules/products/dto';
import { Category } from '@modules/categories/entities/category.entity';
import { Product } from '@modules/products/entities/product.entity';

describe('Products (e2e)', () => {

  let app: INestApplication<App>;
  let dataSource: DataSource;
  let categoryRepository: Repository<Category>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    );

    await app.init();

    dataSource         = moduleFixture.get(DataSource);
    categoryRepository = dataSource.getRepository(Category);
    productRepository  = dataSource.getRepository(Product);

  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products/create (POST)', () => {

    it('should respond with status 400 and return error messages if body dont send', async () => {
    
      const response = await request(app.getHttpServer())
        .post('/products/create');

      const messageArray = response.body.message ?? [];

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      // Comprobar mensajes de error
      expect(messageArray).toContain('title should not be empty');
      expect(messageArray).toContain('title must be a string');
      expect(messageArray).toContain('sizes must be an array');
      expect(messageArray).toContain('each value in sizes must be a string');
      expect(messageArray).toContain('gender must be one of the following values: men, women, kid, unisex');
      expect(messageArray).toContain('categoryId should not be empty');
      expect(messageArray).toContain('categoryId must be a UUID');

    });

    it('should create and return new product', async () => {

      // Crear categoria de pruebas
      const category = categoryRepository.create({
        name: 'Testing Cat'
      });

      await categoryRepository.save(category);

      const dto: CreateProductDto = {
        title: 'Test Product Title',
        sizes: ['XL', 'L', 'M'],
        gender: 'men',
        price: 5,
        stock: 100,
        categoryId: category.id,
      };

      const response = await request(app.getHttpServer())
        .post('/products/create')
        .send(dto);

      expect(response.statusCode).toBe(HttpStatus.CREATED);

      // Comprobar propiedades
      expect(response.body.title).toBe(dto.title);
      expect(response.body.slug).toBe('test-product-title');
      expect(response.body.price).toBe(dto.price);
      expect(response.body.stock).toBe(dto.stock);
      expect(response.body.sizes).toEqual(dto.sizes);
      expect(response.body.gender).toBe(dto.gender);
      expect(response.body.category.name).toBe(category.name);

    });

  }); // /products/create (POST)

  describe('/products/all (GET)', () => {
  
    it('should return paginated products', async () => {

      const response = await request(app.getHttpServer())
        .get('/products/all');

      expect(response.statusCode).toBe(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');

      expect(response.body).toHaveProperty('per_page');
      expect(response.body.per_page).toBe(10);

      expect(response.body).toHaveProperty('current_page');
      expect(response.body.current_page).toBe(1);

      expect(response.body).toHaveProperty('last_page');


    });
  
  }); // /products/all (GET)

  describe('/products/:id (GET)', () => {
  
    it('should return product by ID', async () => {

      // Crear categoria de pruebas
      const category = categoryRepository.create({
        name: 'Testing Cat 2'
      });

      await categoryRepository.save(category);
      
      // Crear registro de pruebas
      const product = productRepository.create({
        title: 'Test Product Test',
        sizes: ['XL', 'L', 'M'],
        gender: 'men',
        price: 5,
        stock: 100,
        category,
      });

      await productRepository.save(product);

      const response = await request(app.getHttpServer())
        .get(`/products/${product.id}`);

      expect(response.statusCode).toBe(HttpStatus.OK);

      expect(response.body.id).toBe(product.id);
      expect(response.body.title).toBe(product.title);
      expect(response.body.slug).toBe(product.slug);

    });
  
    it('should respond with status 400 if dont provided a valid UUID', async () => {

      const response = await request(app.getHttpServer())
        .get(`/products/${'invalid-uuid'}`);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('Validation failed (uuid is expected)');

    });
  
    it('should respond with status 404 with message if product not found', async () => {

      const id = '652dd784-e037-4f8c-8e8c-a6ad176906e4';

      const response = await request(app.getHttpServer())
        .get(`/products/${id}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Product with id ${id} not found`
      );

    });

  }); // /products/:id (GET)


  describe('/products/update/:id (PATCH)', () => {
  
    it('should respond with status 404 if product not found', async () => {

      const id = '953fca78-7813-4132-90f3-7cab339af510';

      const response = await request(app.getHttpServer())
        .patch(`/products/update/${id}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Product with id ${id} not found`
      );
    });

    it('should update product', async () => {

      // Crear categoria de pruebas
      const category = categoryRepository.create({
        name: 'Testing Cat 3'
      });

      await categoryRepository.save(category);
      
      // Crear registro de pruebas
      const product = productRepository.create({
        title: 'Test Product Test 2',
        sizes: ['XL', 'L', 'M'],
        gender: 'men',
        price: 5,
        stock: 100,
        category,
      });

      await productRepository.save(product);

      const response = await request(app.getHttpServer())
        .patch(`/products/update/${product.id}`)
        .send({
          title: 'New Title',
          gender: 'kid',
          price: 10,
        });

      expect(response.statusCode).toBe(HttpStatus.OK);

      expect(response.body.title).toBe('New Title');
      expect(response.body.slug).toBe('new-title');
      expect(response.body.gender).toBe('kid');
      expect(response.body.price).toBe(10);

    });

    it('should update product category', async () => {
      
      // Crear categoria de pruebas
      const category = categoryRepository.create({
        name: 'Testing Cat 4'
      });

      await categoryRepository.save(category);

      // Crear categoria de pruebas
      const categoryUpdated = categoryRepository.create({
        name: 'Testing Cat 5'
      });

      await categoryRepository.save(categoryUpdated);
      
      // Crear registro de pruebas
      const product = productRepository.create({
        title: 'Test Product Test 3',
        sizes: ['XL', 'L', 'M'],
        gender: 'men',
        price: 5,
        stock: 100,
        category,
      });

      await productRepository.save(product);

      const response = await request(app.getHttpServer())
        .patch(`/products/update/${product.id}`)
        .send({
          categoryId: categoryUpdated.id
        });

      expect(response.body.category.id).toBe(categoryUpdated.id);
      expect(response.body.category.name).toBe(categoryUpdated.name);

    });

  }); // /products/update/:id (PATCH)

  describe('/products/delete/:id (DELETE)', () => {
  
    it('should respond with status 404 if product not found', async () => {

      const id = '953fca78-7813-4132-90f3-7cab339af510';

      const response = await request(app.getHttpServer())
        .delete(`/products/delete/${id}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Product with id ${id} not found`
      );

    });

    it('should soft delete product', async () => {

      // Crear categoria de pruebas
      const category = categoryRepository.create({
        name: 'Testing Cat 4'
      });

      await categoryRepository.save(category);
      
      // Crear registro de pruebas
      const product = productRepository.create({
        title: 'Test Product Test 3',
        sizes: ['XL', 'L', 'M'],
        gender: 'men',
        price: 5,
        stock: 100,
        category,
      });

      await productRepository.save(product);

      const response = await request(app.getHttpServer())
        .delete(`/products/delete/${product.id}`);

      expect(response.statusCode).toBe(HttpStatus.OK);

      // Comprobar que deletedAt no sea nulo
      expect(response.body.deletedAt).not.toBeNull();

    });

  }); // /products/delete/:id (DELETE)

});
