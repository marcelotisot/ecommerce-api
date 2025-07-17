

## Validar DTO con class validator

1. Instalar 

```
npm i --save class-validator class-transformer
```

2. Configurar ValidationPipe en el main.ts

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  })
);
```