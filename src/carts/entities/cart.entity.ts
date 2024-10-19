import { 
  CreateDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

import { User } from "../../users/entities/user.entity";
import { CartItem } from "./cart-item.entity";

@Entity({ name: 'carts' })
export class Cart {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    (user) => user.carts
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: User;

  @OneToMany(
    () => CartItem,
    (cartItem) => cartItem.cart,
    { cascade: true, eager: true }
  )
  items: CartItem[];

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
