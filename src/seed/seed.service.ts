import { Injectable } from '@nestjs/common';

import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';

import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

// Forzar valores unicos
// https://github.com/MansurAliKoroglu/enforce-unique
import { UniqueEnforcer } from 'enforce-unique';
import slugify from 'slugify';

@Injectable()
export class SeedService {

  private uniqueEnforcer = new UniqueEnforcer();

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {

    /*
    * Devuelve array de categorias que se va a usar para extraer
    * cada categoria y asignarla aleatoriamente al registrar un producto
    */
    let categories = await this.insertCategories( 50 );


    /*
    * Recibe cantidad y array de categorias para extraer
    * una categoria y asignarla aleatoriamente en cada producto
    */
    this.insertProducts( 500, categories );


    return 'SEED EXECUTED';
  }

  setSlug( value: string ) {
    let slug = slugify( value.trim(), '_' );
    return slug;
  }

  /*
  * INSERTAR DATOS DE PRUEBA
  * --------------------------------------------------------
  * CATEGORIAS
  */
  private async insertCategories( quantity: number ) {

    // Eliminar todos los registros
    await this.categoriesService.deleteAllCategories();

    let count = 0;

    let catsArray = [];

    do {
      
      // TODO:  FIX: Generar slug
      let category = this.categoryRepo.create({
        // Forzar valores unicos
        name: this.uniqueEnforcer.enforce(() => {  
          return faker.internet.userName() 
        })
      });

      let savedCategory = await this.categoryRepo.save(category)


      catsArray.push(savedCategory);

      count++;

    } while ( count < quantity );

    return catsArray;

  }

  /*
  * INSERTAR DATOS DE PRUEBA
  * --------------------------------------------------------
  * PRODUCTOS
  */
  private async insertProducts( quantity: number, catsArray: any ) {

    // Eliminar todos los registros
    await this.productsService.deleteAllProducts();

    let count = 0;

    do {

      // TODO:  FIX: Generar slug
      let product = this.productRepo.create({
        // Forzar valores unicos
        title: this.uniqueEnforcer.enforce(() => { 
          return faker.commerce.productName()
        }),
        description: faker.commerce.productDescription(),
        price: Number( faker.commerce.price({min: 1500, max: 900000 }) ),
        stock: faker.number.int({min: 20, max: 250 })
      });

      /*
      * Obtener y asignar una categoria aleatoria
      */
      const array = catsArray;
      let randomCategory = Math.floor(Math.random() * array.length);
      product.category = array[randomCategory];
      
      this.productRepo.save(product);

      count++;

    } while ( count < quantity );

  }

}
