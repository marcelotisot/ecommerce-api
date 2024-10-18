import { 
  BadRequestException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';

import {
  UpdateUserDto, 
  ChangePasswordDto 
} from './dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findAllUsers(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.userRepository.find({
      take: limit,
      skip: offset,
      select: {
        id: true, firstName: true, lastName: true,
        email: true, createdAt: true, updatedAt: true
      },
      order: { createdAt: 'DESC' },
      where: { deleted: false }
    });
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new NotFoundException(`User with id ${ id } not found`);

    return user;
  }

  async findUserByEmail(email: string) {

    const user = await this.userRepository.findOneBy({ email });

    if (!user) 
      throw new NotFoundException(`User with email ${ email } not found`);

    return user;

  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });

    if (!user) 
      throw new NotFoundException(`User with id ${id} not found`);

    return this.userRepository.save(user);

  }

  async changeUserPassword(id: string, changePasswordDto: ChangePasswordDto) {

    const user = await this.findUserById(id);

    // Verificar el password anterior con el enviado
    const oldPasswordMatch = await argon.verify(
      user.password, 
      changePasswordDto.oldPassword
    ); 

    if ( oldPasswordMatch ) {
      // Asignar el nuevo password
      user.password = await argon.hash(
        changePasswordDto.newPassword
      );
    }

    return this.userRepository.save(user);

  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    user.deleted = true;
    await this.userRepository.save(user);
  }

}
