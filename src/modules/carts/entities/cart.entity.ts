import { 
  Column, 
  Entity, 
  JoinColumn, 
  OneToMany, 
  OneToOne 
} from "typeorm";

import { User } from "../../../modules/users/entities/user.entity";
import { BaseEntity } from "../../../common";
import { CartItem } from "./cart-item.entity";

@Entity('carts')
export class Cart extends BaseEntity{

  @OneToOne(
    () => User
  )
  @JoinColumn({
     name: 'user_id' 
    })
  user: User;

  @OneToMany(
    () => CartItem, 
    (item) => item.cart, 
    { cascade: true }
  )
  items: CartItem[];

  @Column('int', { 
    default: 0,
    name: 'total_items'
  })
  totalItems: number;
  
}
