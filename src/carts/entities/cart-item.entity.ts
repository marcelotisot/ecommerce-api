import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne,
  PrimaryGeneratedColumn 
} from "typeorm";

import { Product } from "../../products/entities/product.entity";
import { Cart } from "./cart.entity";

@Entity({ name: 'cart-items' })
export class CartItem {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Cart,
    (cart) => cart.items
  )
  @JoinColumn({
    name: 'cart_id'
  })
  cart: Cart;

  @ManyToOne(
    () => Product,
    (product) => product.id
  )
  @JoinColumn({
    name: 'product_id'
  })
  product: Product;

  @Column({
    type: 'int',
    nullable: false
  })
  quantity: number;

}
