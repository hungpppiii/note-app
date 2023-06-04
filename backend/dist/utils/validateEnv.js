"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGODB_URI: (0, validators_1.str)(),
    PORT: (0, validators_1.port)({ default: 5000 }),
    NODE_ENV: (0, validators_1.str)({
        choices: ['development', 'test', 'production', 'staging'],
    }),
    SESSION_SECRET: (0, validators_1.str)(),
    REDIS_URL: (0, validators_1.str)(),
});
