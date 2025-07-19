jest.setTimeout(10000); // Aumenta el timeout global a 10 segundos

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { Category } from '@modules/categories/entities/category.entity';

describe('Categories (e2e)', () => {

  let app: INestApplication<App>;
  let dataSource: DataSource;
  let categoryRepository: Repository<Category>;

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

  });

  afterAll(async () => {
    await app.close();
  });

  describe('/categories/create (POST)', () => {

    it('should respond with status 400 and return error messages if body dont send', async () => {

      const response = await request(app.getHttpServer())
        .post('/categories/create');

      const messageArray = response.body.message ?? [];

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      // Comprobar mensajes de error
      expect(messageArray).toContain('name should not be empty');
      expect(messageArray).toContain('name must be longer than or equal to 4 characters');
      expect(messageArray).toContain('name must be a string');

    });

    it('should create and return new category', async () => {

      const response = await request(app.getHttpServer())
        .post('/categories/create')
        .send({
          name: 'Test Category'
        });

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      
      // Comprobar propiedades
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Category');
      expect(response.body.slug).toBe('test-category');

    });

  }); // /categories/create (POST)

  describe('/categories/all (GET)', () => {

    it('should return paginated categories', async () => {

      const response = await request(app.getHttpServer())
        .get('/categories/all');

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

  }); // /categories/all (GET)
  
  describe('/categories/:id (GET)', () => {

    it('should return category by ID', async () => {
      
      // Crear registro de pruebas
      const category = categoryRepository.create({
        name: 'Test'
      });

      await categoryRepository.save(category);

      const response = await request(app.getHttpServer())
        .get(`/categories/${category.id}`);

      expect(response.statusCode).toBe(HttpStatus.OK);

      expect(response.body.id).toBe(category.id);
      expect(response.body.name).toBe('Test');
      expect(response.body.slug).toBe('test');

    });

    it('should respond with status 400 if dont provided a valid UUID', async () => {

      const response = await request(app.getHttpServer())
        .get(`/categories/${'invalid-uuid'}`);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('Validation failed (uuid is expected)');

    });

    it('should respond with status 404 with message if category not found', async () => {

      const id = '652dd784-e037-4f8c-8e8c-a6ad176906e4';

      const response = await request(app.getHttpServer())
        .get(`/categories/${id}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Category with id ${id} not found`
      );

    });

  }); // /categories/:id (GET)

  describe('/categories/update/:id (PATCH)', () => {

    it('should respond with status 404 if category not found', async () => {

      const id = '953fca78-7813-4132-90f3-7cab339af510';

      const response = await request(app.getHttpServer())
        .patch(`/categories/update/${id}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Category with id ${id} not found`
      );
    });

    it('should update category', async () => {

      // Crear registro de pruebas
      const category = categoryRepository.create({
        name: 'Old Name'
      });

      await categoryRepository.save(category);

      const response = await request(app.getHttpServer())
        .patch(`/categories/update/${category.id}`)
        .send({
          name: 'New Name'
        });

      expect(response.statusCode).toBe(HttpStatus.OK);

      expect(response.body.name).toBe('New Name');
      expect(response.body.slug).toBe('new-name');
      
    });

  }); // /categories/update/:id (PATCH)

  describe('/categories/delete/:id (DELETE)', () => {

    it('should respond with status 404 if category not found', async () => {

      const id = '953fca78-7813-4132-90f3-7cab339af510';

      const response = await request(app.getHttpServer())
        .delete(`/categories/delete/${id}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Category with id ${id} not found`
      );

    });

    it('should soft delete category', async () => {

      // Crear registro de pruebas
      const category = categoryRepository.create({
        name: 'Deleted Category'
      });

      await categoryRepository.save(category);

      const response = await request(app.getHttpServer())
        .delete(`/categories/delete/${category.id}`);

      expect(response.statusCode).toBe(HttpStatus.OK);

      // Comprobar que deletedAt no sea nulo
      expect(response.body.deletedAt).not.toBeNull();

    });

  }); // /categories/delete/:id (DELETE)

});
