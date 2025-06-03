import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto, LoginUserDto } from '../dto';
import { User } from '../../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    private readonly jwtService: JwtService
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {

    const { fullName, email, password } = registerUserDto;

    const user = this.userRepository.create({
      fullName,
      email,
      password: await argon.hash(password)
    });

    await this.userRepository.save(user);

    const payload: JwtPayload= {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles
    }

    return {
      user,
      token: await this.generateToken(payload)
    }

  }

  async loginUser(loginUserDto: LoginUserDto) {
    
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        roles: true
      }
    });

    if (!user) {
      throw new UnauthorizedException(`Invalid credentials (email)`);
    }

    // Comparar passwords
    const isMatchPassword = await argon.verify(user.password, password);

    if (!isMatchPassword) {
      throw new UnauthorizedException(`Invalid credentials (password)`);
    }

    const payload: JwtPayload= {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles
    }

    return {
      user,
      token: await this.generateToken(payload)
    }

  }

  private async generateToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;

  }

}
