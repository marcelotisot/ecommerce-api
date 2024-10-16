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

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  findAll() {
    return this.userRepo.find({
      where: { deleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user)
      throw new NotFoundException(`User with id ${ id } not found`);

    return user;
  }

  async findOneByEmail(email: string) {

    const user = await this.userRepo.findOneBy({ email });

    if (user) 
      throw new BadRequestException(`User with email ${ email } already exists`);

    return user;

  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepo.preload({
      id: id,
      ...updateUserDto
    });

    if (!user) 
      throw new NotFoundException(`User with id ${id} not found`);

    return this.userRepo.save(user);

  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {

    const user = await this.findOne(id);

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

    return this.userRepo.save(user);

  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.deleted = true;
    await this.userRepo.save(user);
  }

}
