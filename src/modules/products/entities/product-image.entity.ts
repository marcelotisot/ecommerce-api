import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";

import { Product } from "./product.entity";

@Entity('product-images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  url: string; // Url publica de AWS S3

  @ManyToOne(
    () => Product,
    (product) => product.images
  )
  @JoinColumn({
      name: 'product_id'
  })
  product?: Product;
}