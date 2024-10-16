import { 
  BeforeInsert,
  BeforeUpdate,
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity({name:'users'})
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
    nullable: false
  })
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: false
  })
  lastName: string;

  @Column({
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    nullable: false,

    // Excluye el password de las busquedas
    select: false  
  })
  password: string;

  @Column({ 
    name: 'is_active',
    default: true 
  })
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

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

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }


}
