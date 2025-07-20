import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  Entity 
} from "typeorm";

import { BaseEntity } from "@common/entities/base.entity";

@Entity('users')
export class User extends BaseEntity {

  @Column('text', {
    name: 'full_name'
  })
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
    default: true,
    name: 'is_active'
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[];

  /*
  * Eliminar mayusculas y espacios al insertar / actualizar
  */
  @BeforeInsert()
  emailToLowerCaseOnInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.email = this.email.toLowerCase().trim();
  }

}
