import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";

let mockProductRepository: Partial<Record<keyof Repository<Product>, jest.Mock>>;

mockProductRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softRemove: jest.fn(),
} 

export { 
  mockProductRepository 
};