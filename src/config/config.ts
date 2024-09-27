import { validateEnv } from './env.validation';

export default () => {
  const env = validateEnv();

  return {
    app: {
      port: env.APP_PORT,
    },
    database: {
      mongoUri: env.MONGO_URI,
      redis: {
        port: env.REDIS_PORT,
        host: env.REDIS_HOST,
      },
    },
    environment: env.NODE_ENV,
    google: {
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      emailUser: env.EMAIL_USER,
      refreshToken: env.REFRESH_TOKEN,
      redirectUri: env.REDIRECT_URI,
    },
    client: {
      baseUrl: env.CLIENT_BASE_URL,
    },
    jwt: {
      secret: env.JWT_SECRET,
    },
  };
};
