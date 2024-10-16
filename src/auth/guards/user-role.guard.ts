import { 
  BadRequestException, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  Injectable 
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Verificar roles del usuario y autorizar
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    // Si no viene ningun rol lo deja pasar
    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new BadRequestException('User not found');

    /*
    * Si incluye uno de los roles especificos
    * pasa la peticion
    */
    for (const role of user.roles) {
      if ( validRoles.includes( role ) ) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${ user.firstName + user.lastName } need a valid role`
    );
  }
}
