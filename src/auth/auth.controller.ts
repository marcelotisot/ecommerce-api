import { 
  Body, 
  Controller, 
  Get, 
  Headers, 
  Post, 
  Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto ) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // Obtener el request completo
    @Req() request: Express.Request,
    // Obtener el usuario completo
    @GetUser() user: User,
    // Obtener un dato especifico
    @GetUser('id') userId: string,
    @GetUser('email') userEmail: string,
    // Obtener los headers
    @Headers() headers: IncomingHttpHeaders,
  ) {

    console.log(request);

    return {
      ok: true,
      user,
      userId,
      userEmail,
      headers,
    }
  }

  /*
  * @RoleProtected( ValidRoles.admin )
  * @UseGuards( AuthGuard(), UserRoleGuard )
  * --------------------------------------------------------------
  * SE AGRUPARON AMBOS DECORADORES EN EL AuthDecorator
  */
  @Get('private2')
  @RoleProtected( ValidRoles.admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }

  }

  /*
  * @Auth( ValidRoles.admin ) ACCESO SOLO A UN ADMIN
  * @Auth() ACCESO A CUALQUIER USUARIO
  */
  @Get('private3')
  @Auth( ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }

  }
  
}
