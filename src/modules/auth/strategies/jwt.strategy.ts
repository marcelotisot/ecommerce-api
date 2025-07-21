
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces";
import { User } from "@modules/users/entities/user.entity";
import { envs } from "@config/envs";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) {

    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

  }

  async validate( payload: JwtPayload ): Promise<User> {
    
    const { email } = payload;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    return user;

  }
  
}