import { BaseEntity } from "../../../common";
import { Column, Entity } from "typeorm";

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

}