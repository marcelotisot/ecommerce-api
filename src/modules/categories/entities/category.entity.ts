import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  Entity,
  OneToMany
} from "typeorm";

import { BaseEntity } from "@common/entities/base.entity";
import { Product } from "@modules/products/entities/product.entity";
import slugify from "slugify";

@Entity('categories')
export class Category extends BaseEntity {

  @Column('varchar', {
    length: 80
  })
  name: string;

  @Column('text', {
    unique: true
  })
  slug: string;

  @OneToMany(
    () => Product, 
    (product) => product.category
  )
  products: Product[];

  /*
  * Generar slug automaticamente al insertar / actualizar
  */
  @BeforeInsert()
  generateSlugOnInsert() {
    this.slug = slugify(this.name.toLowerCase().trim());
  }

  @BeforeUpdate()
  generateSlugOnUpdate() {
    this.slug = slugify(this.name.toLowerCase().trim());
  }

}
