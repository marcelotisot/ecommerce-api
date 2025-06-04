import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

// Dtos
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../../common';

// Mocks
import { 
  mockUserRepository,
  mockPaginatedUsers,
  mockUser
 } from '../__mocks__/users';

describe('UsersService', () => {

  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.resetAllMocks(); // Resetear todos los mocks antes de cada test
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Test findAll()
   */
  it('should return paginated users', async () => {

    const dto: PaginationDto = { page: 1, limit: 10 };

    const total = 2; // Se ajusta para que coincida con el total de mockPaginatedProducts

    // Simulamos lo que devolvería findAndCount
    mockUserRepository.findAndCount?.mockResolvedValue([mockPaginatedUsers, total]);
    
    jest.spyOn(service, 'findAll');

    const result = await service.findAll(dto);

    expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: {
        createdAt: 'DESC'
      }
    });

    expect(result).toEqual({
      data: mockPaginatedUsers,
      meta: {
        total: 2,
        per_page:10,
        current_page: 1,
        last_page: 1
      }
    });

    expect(mockUserRepository.findAndCount).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(dto);

  });

  /**
   * Test findOne()
   */
  describe('findOne()', () => {

    it('should return user when found', async () => {

      const id = mockUser.id;

      mockUserRepository.findOneBy?.mockResolvedValue(mockUser);

      const result = await service.findOne(id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });

    });

    it('should throw NotFoundException when user not found', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      // Mockeamos findOneBy() para que retorne null y lance la exception
      mockUserRepository.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });

    });

  });

  /**
   * Test update()
   */
  describe('update()', () => {

    it('should update and return the user if found', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      const dto: UpdateUserDto = { fullName: 'Updated fullName' };

      // Simulamos el resultado
      const preloadResult = {
        id,
        ...dto
      };

      mockUserRepository.preload?.mockResolvedValue(preloadResult);
      mockUserRepository.save?.mockResolvedValue(preloadResult);

      const result = await service.update(id, dto);

      expect(mockUserRepository.preload).toHaveBeenCalledWith({ id, ...dto });
      expect(mockUserRepository.save).toHaveBeenCalledWith(preloadResult);

      expect(result).toEqual(preloadResult);

    });

    it('should throw NotFoundException if user does not exist', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      const dto: UpdateUserDto = { fullName: 'Updated fullName' };

      // Mockeamos preload() para que retorne null y lance la exception
      mockUserRepository.preload?.mockResolvedValue(null);

      // Evaluamos la respuesta con el error
      await expect(service.update(id, dto)).rejects.toThrow(
        new NotFoundException(`User with id ${id} not found`)
      );

      // Evaluamos que llame correctamente a preload() con el id y DTO
      expect(mockUserRepository.preload).toHaveBeenCalledWith({ id, ...dto });

      // Si se lanza la exception save() no deberia ser llamado
      expect(mockUserRepository.save).not.toHaveBeenCalled();

    });

  });

  /**
   * Test remove()
   */
  describe('remove()', () => {

     it('should soft remove a user and return success response', async () => {

      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      // Mock de findOne dentro del propio servicio
      service.findOne = jest.fn().mockResolvedValue(mockUser);

      mockUserRepository.softRemove?.mockResolvedValue(mockUser);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);

      // Evaluamos que softRemove se invoca con la entidad correcta
      expect(mockUserRepository.softRemove).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual({ message: 'User deleted' });

    });

     it('should throw NotFoundException if user does not exist', async () => {
    
      const id = 'd31366de-3519-4feb-8e30-bb59636ed41d';

      service.findOne = jest.fn().mockRejectedValue(new NotFoundException);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.softRemove).not.toHaveBeenCalled();

    });

  });

});
