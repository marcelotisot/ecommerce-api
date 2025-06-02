import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

import { 
  PaginatedResult, 
  PaginationDto 
} from '../../../common';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {

    const { page = 1, limit = 10} = paginationDto;
    
    const skip = ( page - 1 ) * limit;

    const [users, total] = await this.userRepository.findAndCount({

      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
      
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: users,

      meta: {
        total: total,
        per_page: Number(limit),
        current_page: Number(page),
        last_page: lastPage
      }
    }

  }

  async findOne(id: string): Promise<User> {

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;

  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.userRepository.save(user);

  }

  async remove(id: string): Promise<{ message: string }> {

    const user = await this.findOne(id);

    await this.userRepository.softRemove(user);

    return { message: 'User deleted' };

  }
  
}
