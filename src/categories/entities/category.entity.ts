import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

import { Product } from "src/products/entities/product.entity";

@Entity({ name: 'categories' })
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'category_name',
    unique: true,
    nullable: false
  })
  categoryName: string;

  @Column({ 
    name: 'category_slug',
    unique: true,
    nullable: true,
  })
  categorySlug: string;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(
    () => Product,
    (product) => product.category
  )
  products?: Product[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at'
  })
  updatedAt: Date;

}
