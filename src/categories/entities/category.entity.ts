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
    unique: true,
    nullable: false
  })
  name: string;

  @Column({ 
    unique: true,
    nullable: true,
  })
  slug: string;

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
