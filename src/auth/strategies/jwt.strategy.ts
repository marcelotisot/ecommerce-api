import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";

import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),

      // Se enviara el token en cada peticion como Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /*
  * validate() se va a llamar si el jwt no expiro
  * y si la firma del jwt hace match con el payload
  */
  async validate( payload: JwtPayload ): Promise<User> {


    const { email } = payload;

    // Validar payload
    const user = await this.userRepo.findOneBy({ email });

    if ( !user )
      throw new UnauthorizedException(`Token not valid`);

    if ( !user.isActive )
      throw new UnauthorizedException(`User is inactive`);
    

    return user;
  }

}
