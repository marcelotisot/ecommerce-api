import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity"; 

@Entity({name: 'images'})
export class Image {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'text',
    nullable: false
  })
  url: string;

  @ManyToOne(
    () => Product,
    (product) => product.images
  )
  product: Product;

}
