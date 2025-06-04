import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn
} from "typeorm";

import { Product } from "../../../modules/products/entities/product.entity";
import { Order } from "./order.entity";

@Entity('order-items')
export class OrderItem {

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

  @Column('numeric', {
    precision: 10,
    scale: 2
  })
  price: number;

  @ManyToOne(
    () => Order, 
    (order) => order.items, 
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({
    name: 'order_id'
  })
  order: Order;

}