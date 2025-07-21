import { 
  BadRequestException, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto } from '../dto';
import { AuthResponse, JwtPayload } from '../interfaces';
import * as argon from 'argon2';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

    const payload = this.generatePayload(newUser);

    return {
      user: rest,
      token: this.generateToken(payload)
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

    const payload = this.generatePayload(user);

    return {
      user: rest,
      token: this.generateToken(payload)
    }

  }

  private generateToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;

  }

  // Generar y retornar el payload a firmar
  private generatePayload(user: User): JwtPayload {

    const payload: JwtPayload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles,
    };

    return payload;

  }

}
