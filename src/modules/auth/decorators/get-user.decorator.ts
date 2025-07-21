/*
* Decorador para extraer el usuario del request
*/
import { 
  createParamDecorator, 
  ExecutionContext, 
  InternalServerErrorException 
} from "@nestjs/common";

export const GetUser = createParamDecorator(

  (data: string, ctx: ExecutionContext) => {

    const req  = ctx.switchToHttp().getRequest();
    const user = req.user;

    if(!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    // Si se envia data: 'email', 'id' etc..
    // retorna data sino el usuario completo
    return (!data) ? user : user[data];

  }

);