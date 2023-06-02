import { cleanEnv } from 'envalid';
import { str, port } from 'envalid/dist/validators';

export default cleanEnv(process.env, {
    MONGODB_URI: str(),
    PORT: port({ default: 5000 }),
    NODE_ENV: str({
        choices: ['development', 'test', 'production', 'staging'],
    }),
    SESSION_SECRET: str(),
});
