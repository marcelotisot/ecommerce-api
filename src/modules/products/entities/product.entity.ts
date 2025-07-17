import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  Entity, 
  ManyToOne 
} from "typeorm";

import { BaseEntity } from "@common/entities/base.entity";
import { Category } from "@modules/categories/entities/category.entity";
import { DecimalColumnTransformer } from "@utils/decimal-column.transformer";
import slugify from "slugify";

@Entity('products')
export class Product extends BaseEntity {

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('decimal', {
    default: 0,
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer()
  })
  price: number;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @ManyToOne(
    () => Category, 
    (category) => category.products,
    { eager: true },
  )
  category: Category;

  /*
  * Generar slug automaticamente al insertar / actualizar.
  */
  @BeforeInsert()
  generateSlugOnInsert() {
    this.slug = slugify(this.title.toLowerCase().trim());
  }

  @BeforeUpdate()
  generateSlugOnUpdate() {
    this.slug = slugify(this.title.toLowerCase().trim());
  }

}
