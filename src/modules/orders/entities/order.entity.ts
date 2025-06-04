import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  OneToMany 
} from "typeorm";

import { User } from "../../../modules/users/entities/user.entity";
import { BaseEntity } from "../../../common";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "../enums/order-status.enum";

@Entity('orders')
export class Order extends BaseEntity{ 

  @ManyToOne(
    () => User,
    (user) => user.orders
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: User;

  @OneToMany(
    () => OrderItem, 
    (item) => item.order, 
    { cascade: true }
  )
  items: OrderItem[];

  @Column('numeric', {
    precision: 10,
    scale: 2,
    nullable: true
  })
  total: number;

  @Column('enum', {
    enum: OrderStatus,
    default: OrderStatus.pending
  })
  status: OrderStatus;

}
