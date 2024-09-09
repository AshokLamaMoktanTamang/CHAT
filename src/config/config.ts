import { validateEnv } from './env.validation';

export default () => {
  const env = validateEnv();

  return {
    app: {
      port: env.APP_PORT,
    },
    database: {
      mongoUri: env.MONGO_URI,
    },
    environment: env.NODE_ENV,
  };
};
