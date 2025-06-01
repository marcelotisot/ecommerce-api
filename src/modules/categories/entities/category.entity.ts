import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  Entity, 
  OneToMany
} from "typeorm";

import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from "../../../modules/products/entities/product.entity";
import slugify from "slugify";

@Entity('categories')
export class Category extends BaseEntity {

  @Column('text', {
    unique: true
  })
  name: string;

  @Column('text', {
    unique: true,
    nullable: true
  })
  slug: string;

  @OneToMany(
    () => Product,
    (product) => product.category,
    { cascade: true }
  )
  products: Product[];

  @BeforeInsert()
  generateSlugInsert?() {
    this.slug = slugify(this.name).toLowerCase().trim();
  }

  @BeforeUpdate()
  generateSlugUpdate?() {
    this.slug = slugify(this.name).toLowerCase().trim();
  }

}
