import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";

let mockCategoryRepository: Partial<Record<keyof Repository<Category>, jest.Mock>>;

mockCategoryRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softRemove: jest.fn(),
} 

export { 
  mockCategoryRepository 
};