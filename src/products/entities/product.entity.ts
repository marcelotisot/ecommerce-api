import { Category } from "src/categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Image } from '../../images/entities/image.entity';

@Entity({name: 'products'})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false
  })
  title: string;
  
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({
    type: 'float',
    default: 0,
    nullable: false
  })
  price: number;

  @Column({
    unique: true,
    nullable: true
  })
  slug: string;

  @Column({
    type: 'int',
    default: 0
  })
  stock: number;

  @Column({ default: false })
  deleted: boolean;

  @ManyToOne(
    () => Category,
    (category) => category.products,
    { onDelete: "SET NULL" }
  )
  category: Category;

  // Imagenes
  @OneToMany(
    () => Image,
    (image) => image.product,
    {cascade: true, eager: true}
  )
  images?: Image[];

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
