import { 
  Column, 
  CreateDateColumn,
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

import { Product } from "../../products/entities/product.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'reviews' })
export class Review {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    (user) => user.reviews
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: User;

  @ManyToOne(
    () => Product,
    (product) => product.reviews
  )
  @JoinColumn({
    name: 'product_id'
  })
  product: Product;

  @Column({
    type: 'text',
    nullable: false
  })
  comment: string;

  @Column({ default: false })
  deleted: boolean;

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
