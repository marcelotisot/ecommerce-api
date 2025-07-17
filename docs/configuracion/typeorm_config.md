
## Instalar y configurar TypeORM

1. Instalar para usar con postgres

```
npm install --save @nestjs/typeorm typeorm pg
```

2. Generar modulo Database y configurar conexion

```
nest g mo modules/database
```


```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      entities: [],
      synchronize: true,
    })
  ]
})
export class DatabaseModule {}
```
