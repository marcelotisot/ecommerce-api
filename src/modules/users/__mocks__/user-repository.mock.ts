import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

let mockUserRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;

mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softRemove: jest.fn(),
} 

export { 
  mockUserRepository 
};