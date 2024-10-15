import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepo.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    // Comparar passwords
    const isMatch = await argon.verify(user.password, password);

    if ( !isMatch )
      throw new UnauthorizedException('Invalid credentials');

    return user;

    //TODO: Retornar el JWT

  }

}
