import { 
  createParamDecorator, 
  ExecutionContext, 
  InternalServerErrorException 
} from "@nestjs/common";

export const GetUser = createParamDecorator(

  ( data: string, ctx: ExecutionContext) => {

    // Extraer el usuario del request
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    // Regresar el usuario completo o el dato en especifico
    return ( !data ) ? user : user[data];

  }

);