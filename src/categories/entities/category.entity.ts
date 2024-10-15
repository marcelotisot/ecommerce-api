import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity({ name: 'categories' })
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'category_name',
    unique: true,
    length: 30,
    nullable: false
  })
  categoryName: string;

  @Column({ 
    name: 'category_slug',
    unique: true,
    nullable: true,
  })
  categorySlug: string;

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

}
