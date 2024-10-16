import { 
  BadRequestException, 
  Injectable, 
  Logger, 
  UnauthorizedException 
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidRoles } from './enums/valid-roles.enum';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(registerUserDto: RegisterUserDto) {

    const { isAdmin } = registerUserDto;

    // Comprobar si ya existe un usuario con el correo enviado
    const userExists = await this.userRepo.findOneBy({ email: registerUserDto.email });

    if ( userExists )
      throw new BadRequestException(`User with email ${registerUserDto.email} already exists`);

    if ( !userExists ) {
      // Encriptar password
      const hash = await argon.hash(registerUserDto.password);
      
      const user = this.userRepo.create({
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        email: registerUserDto.email,
        password: hash
      });

      //Si enviamos la propiedad isAdmin: true
      if ( isAdmin ) {
        // Asignamos el rol de admin ademas del de user por defecto
        user.isAdmin = true;
        user.roles = [ ValidRoles.user, ValidRoles.admin ];
      }

      await this.userRepo.save(user);

      // Generar JWT
      const payload: JwtPayload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }

      return {
        ...user,
        token: this.generateJwtToken( payload ),
      }
    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepo.findOne({
      where: { email },
      select: { 
        id: true,
        firstName: true,
        lastName: true,
        email: true, 
        password: true 
      }
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    // Comparar passwords
    const isMatch = await argon.verify(user.password, password);

    if ( !isMatch )
      throw new UnauthorizedException('Invalid credentials');

    // Generar JWT
    const payload: JwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    return {
      ...user,
      token: this.generateJwtToken( payload )
    }

  }

  private generateJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }

}
