import { cleanEnv, str, port, url } from 'envalid';

export const validateEnv = () =>
  cleanEnv(process.env, {
    MONGO_URI: str({
      desc: 'MongoDB connection string for the database',
      example: 'mongodb://localhost:27017/chat-api',
    }),
    APP_PORT: port({
      desc: 'Port number on which the application will run',
      default: 3000,
    }),
    NODE_ENV: str({
      desc: 'The environment in which the app is running',
      choices: ['development', 'production', 'test'],
      default: 'development',
    }),
    REDIS_HOST: str(),
    REDIS_PORT: port({
      desc: 'Port number on which the redis server will run',
      default: 6379,
    }),
    EMAIL_USER: str(),
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    REDIRECT_URI: str(),
    REFRESH_TOKEN: str(),
    CLIENT_BASE_URL: url({ default: 'http://localhost:4200' }),
    JWT_SECRET: str({ default: 'SECRET' }),
  });
