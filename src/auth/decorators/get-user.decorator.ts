import { 
  createParamDecorator, 
  ExecutionContext, 
  InternalServerErrorException 
} from "@nestjs/common";

export const GetUser = createParamDecorator(
  ( data, ctx: ExecutionContext ) => {
    
    // Extraer el request del contexto
    const req = ctx.switchToHttp().getRequest();
    // Retornar el usuario
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    return user;

  }
);
