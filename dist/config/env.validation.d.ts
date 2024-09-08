export declare const validateEnv: () => Readonly<{
    MONGO_URI: string;
    APP_PORT: number;
    NODE_ENV: "development" | "production" | "test";
} & import("envalid").CleanedEnvAccessors>;
