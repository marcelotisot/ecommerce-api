import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthResponse } from '../interfaces';
import * as argon from 'argon2';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<AuthResponse> {

    const { password, ...userData } = registerUserDto;

    const user = await this.userRepository.findOneBy({ email: userData.email });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.userRepository.create({
      ...userData,
      password: await argon.hash(password),
    });

    await this.userRepository.save(newUser);

    // Excluir el password
    const { password: __, ...rest } = newUser;

    return {
      user: rest,
      token: 'ASDSADASDASDASDASDSAADSAasdkandkasdnksd1231231asd'
    }


  }

  async loginUser(loginUserDto: LoginUserDto): Promise<AuthResponse> {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        isActive: true,
        roles: true,
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }

    // Comparar passwords
    const isMatch = await argon.verify(user.password, password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    // Excluir el password
    const { password: __, ...rest } = user;

    return {
      user: rest,
      token: 'ASDSADASDASDASDASDSAADSAasdkandkasdnksd1231231asd'
    }


  }

}
