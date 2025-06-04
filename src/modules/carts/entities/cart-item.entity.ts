import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";

import { Product } from "../../../modules/products/entities/product.entity";
import { Cart } from "./cart.entity";

@Entity('cart-items')
export class CartItem {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Product
  )
  @JoinColumn({
    name: 'product_id'
  })
  product: Product;

  @Column('int')
  quantity: number;

  @ManyToOne(
    () => Cart, 
    (cart) => cart.items, 
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({
    name: 'cart_id'
  })
  cart: Cart;
  
}