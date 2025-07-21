import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { envs } from '@config/envs';

@Module({
  imports: [
    
    UsersModule,

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

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
  exports: [
    JwtStrategy, 
    PassportModule, 
    JwtModule
  ]
})
export class AuthModule {}
