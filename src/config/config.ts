import { validateEnv } from "./env.validation";

export default () => {
  validateEnv()
  
  return {
    app: {
      port: parseInt(process.env.APP_PORT, 10) || 3001,
    },
    database: {
      mongoUri: process.env.MONGO_URI,
    },
    environment: process.env.NODE_ENV,
  };
};
