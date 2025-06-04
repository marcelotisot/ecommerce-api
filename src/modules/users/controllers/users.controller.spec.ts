import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { PaginationDto } from '../../../common';
import { UpdateUserDto } from '../dto/update-user.dto';

// Mocks
import { 
  mockPaginatedUsers, 
  mockUser, 
  mockUsersService 
} from '../__mocks__/users';
import { CreateUserDto } from '../dto';



describe('UsersController', () => {

  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service    = module.get<UsersService>(UsersService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service create method with valid dto and return created user', async () => {

    const dto: CreateUserDto = {
      fullName: 'Test user',
      email: 'testuser@google.com',
      password: 'Abc123'
    };

    jest.spyOn(service, 'create').mockResolvedValue(mockUser);

    const result = await controller.create(dto);

    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);

  });

  it('should call service findAll method with paginationDto and return paginated users', async () => {

    const dto: PaginationDto = { page: 1, limit: 10 };

    jest.spyOn(service, 'findAll').mockResolvedValue(mockPaginatedUsers);

    const result = await controller.findAll(dto);

    expect(result).toEqual(mockPaginatedUsers);
    expect(service.findAll).toHaveBeenCalledWith(dto);

  });

  it('should return user by id', async () => {

    const id = mockUser.id;

    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

    const result = await controller.findOne(id);

    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(id);

  });
  
  it('should update user', async () => {

    const id = mockUser.id;

    const dto: UpdateUserDto = {
      fullName: 'Updated User fullName'
    };

    const updatedUser = { id, ...dto };

    jest.spyOn(service, 'update').mockResolvedValue(updatedUser as User);

    const result = await controller.update(id, dto);

    expect(service.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(updatedUser);

  });

  it('should delete user and return success message', async () => {

    const id = mockUser.id;

    // Llamamos al método y simulamos el comportamiento
    jest.spyOn(service, 'remove').mockImplementation(async (_id) => {
      return { message: 'User deleted' };
    });

    const result = await controller.remove(id);

    expect(service.remove).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: 'User deleted' });

  });

});
