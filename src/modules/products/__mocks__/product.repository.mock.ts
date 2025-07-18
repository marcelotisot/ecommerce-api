export const mockProductRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softRemove: jest.fn(),
};