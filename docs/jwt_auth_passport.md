
### Implementar autenticacion con Passport

Instalar librerias necesarias

```bash
npm install --save @nestjs/passport passport @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

Configurar AuthModule

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
