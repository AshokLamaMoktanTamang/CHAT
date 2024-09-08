"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const envalid_1 = require("envalid");
const validateEnv = () => (0, envalid_1.cleanEnv)(process.env, {
    MONGO_URI: (0, envalid_1.str)({
        desc: 'MongoDB connection string for the database',
        example: 'mongodb://localhost:27017/chat-api',
    }),
    APP_PORT: (0, envalid_1.port)({
        desc: 'Port number on which the application will run',
        default: 3000,
    }),
    NODE_ENV: (0, envalid_1.str)({
        desc: 'The environment in which the app is running',
        choices: ['development', 'production', 'test'],
        default: 'development',
    }),
});
exports.validateEnv = validateEnv;
//# sourceMappingURL=env.validation.js.map