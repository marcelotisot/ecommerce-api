
## Configurar variables de entorno

1. Instalar librerias necesarias

```
npm i joi dotenv
```

2. Crear archivos de entorno:

- .env.development
- .env.production
- .env.test

3. Crear archivo ./config/envs.ts y validar el esquema con joi

4. Instalar cross-env para ejecutar comandos enviando NODE_ENV

```
npm install --save-dev cross-env
```

4. Configurar scripts en el package.json

```json
"scripts": {
  "start:dev": "cross-env NODE_ENV=development nest start --watch",
  "start:prod": "cross-env NODE_ENV=production node dist/main.js",
  "test": "cross-env NODE_ENV=test jest"
}

```

5. Correr aplicacion aplicando los diferentes entornos

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Test
npm run test
```