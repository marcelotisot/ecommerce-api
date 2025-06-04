import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common";
import { Order } from "../../../modules/orders/entities";

@Entity('users')
export class User extends BaseEntity{

  @Column('text')
  fullName: string;

  @Column('text', {
    unique: true
  })
  email: string;

  @Column('text', {
    select: false
  })
  password: string;

  @Column('bool', {
    default: true
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[];

  @OneToMany(
    () => Order,
    (order) => order.user,
    { cascade: true }
  )
  orders: Order[];

}