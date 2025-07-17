
import * as dotenv from 'dotenv';
import * as joi from 'joi';

/*
* Cargar el archivo de entorno correcto: 
* por defecto es .env.development
*/
const NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({ 
  path: `.env.${NODE_ENV}`,
  quiet: false,
});

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

// Validar el esquema
const envsSchema = joi.object({
  PORT: joi.number().required(),
  NODE_ENV: joi.valid('development', 'production', 'test').required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
})
.unknown(true);

const { error, value }  = envsSchema.validate( process.env );

if (error) {
  throw new Error(`Config validation error: ${ error.message }`);
}

// Exponer las variables
const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USERNAME,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
}