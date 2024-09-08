"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_validation_1 = require("./env.validation");
exports.default = () => {
    (0, env_validation_1.validateEnv)();
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
//# sourceMappingURL=config.js.map