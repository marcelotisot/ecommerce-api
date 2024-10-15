import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';

import { 
  CreateUserDto, 
  UpdateUserDto, 
  ChangePasswordDto 
} from './dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

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

  async create(createUserDto: CreateUserDto) {

    try {

      // Comprobar si ya existe un usuario con el correo enviado
      const userExists = await this.findOneByEmail( createUserDto.email );

      if ( !userExists ) {
        // Encriptar password
        const hash = await argon.hash(createUserDto.password);
        
        const user = this.userRepo.create({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: hash
        });

        await this.userRepo.save(user);

        return user;
      }

    } catch (error) {
      this.handleDBExceptions(error);
    }

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

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error');
  }
}
