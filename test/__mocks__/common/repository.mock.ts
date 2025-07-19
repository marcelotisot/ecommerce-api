/*
* Mock de repositorio con metodos comunes de cada CRUD
*/
export const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softRemove: jest.fn(),
};