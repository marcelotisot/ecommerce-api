import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { envs } from '../../config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [

    forwardRef(() => UsersModule), // Fix dependencia circular

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: envs.jwtSecret,
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],

  /**
   * Exportar para usar fuera de auth.module  
   */
  exports: [
    JwtStrategy, 
    PassportModule, 
    JwtModule
  ]
})
export class AuthModule {}
