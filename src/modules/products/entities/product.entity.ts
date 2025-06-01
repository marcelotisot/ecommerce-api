import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne 
} from "typeorm";

import { BaseEntity } from "../../../common";
import { Category } from "../../../modules/categories/entities/category.entity";
import slugify from "slugify";

@Entity('products')
export class Product extends BaseEntity {

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
    nullable: true
  })
  slug: string;

  @Column('text', {
    nullable: true
  })
  description: string;

  @Column('numeric', {
    precision: 10,
    scale: 2
  })
  price: number;

  @Column('int', {
    default: 0
  })
  stock: number;

  @ManyToOne(
    () => Category,
    (category) => category.products,
    { eager: true }
  )
  @JoinColumn({
      name: 'category_id'
  })
  category?: Category;

  @BeforeInsert()
  generateSlugInsert?() {
    this.slug = slugify(this.name).toLowerCase().trim();
  }

  @BeforeUpdate()
  generateSlugUpdate?() {
    this.slug = slugify(this.name).toLowerCase().trim();
  }

}
