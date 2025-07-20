import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { User } from '../entities/user.entity';
import { PaginationResponse } from '@common/interfaces/pagination-response.interface';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAllUsers(paginationDto: PaginationDto): Promise<PaginationResponse<User>> {
    
    const { limit = 10, page = 1 } = paginationDto;

    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: users,
      total: total,
      per_page: limit,
      current_page: page,
      last_page: Math.ceil(total / limit),
    };

  }

  async findUserById(id: string): Promise<User> {
      
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;

  }

  async findUserByEmail(email: string): Promise<User> {
      
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;

  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.userRepository.save(user);

  }

  async deleteUser(id: string): Promise<User> {
      
    const user = await this.findUserById(id);

    await this.userRepository.softRemove(user);

    return user;

  }

  async banUser(id: string): Promise<User> {
      
    const user = await this.findUserById(id);

    user.isActive = false;

    return this.userRepository.save(user);

  }

}
