import { cleanEnv, str, port } from 'envalid';

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
  });
