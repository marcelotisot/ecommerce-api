import { 
  createParamDecorator, 
  ExecutionContext, 
  InternalServerErrorException 
} from "@nestjs/common";

export const GetUser = createParamDecorator(
  ( data: string, ctx: ExecutionContext ) => {
    
    // Extraer el request del contexto
    const req = ctx.switchToHttp().getRequest();
    // Retornar el usuario
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    // Obtener usuario completo o dato especifico
    return (!data) ? user : user[data];

  }
);
