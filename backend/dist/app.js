"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const morgan_1 = __importDefault(require("morgan"));
const notes_1 = __importDefault(require("./routes/notes"));
const users_1 = __importDefault(require("./routes/users"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("redis");
const http_errors_1 = __importDefault(require("http-errors"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const redisClient = (0, redis_1.createClient)({ url: validateEnv_1.default.REDIS_URL });
redisClient.connect().catch(console.error);
// Initialize store.
const redisStore = new connect_redis_1.default({
    client: redisClient,
    prefix: 'note_app:',
});
const sessionOptions = {
    secret: validateEnv_1.default.SESSION_SECRET,
    cookie: {
        maxAge: 60 * 60 * 1000,
        // cookie same site, comment this line if you are on the same site
        sameSite: 'none',
    },
    saveUninitialized: false,
    store: redisStore,
    resave: false,
    rolling: true,
};
if (validateEnv_1.default.NODE_ENV === 'production' && sessionOptions.cookie !== undefined) {
    app.set('trust proxy', 1); // trust first proxy
    sessionOptions.cookie.secure = true; // serve secure cookies
}
app.use((0, cors_1.default)({ origin: validateEnv_1.default.CLIENT_URL, credentials: true }));
app.use((0, express_session_1.default)(sessionOptions));
// parse application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
// config routes
app.use('/api/notes', auth_1.default, notes_1.default);
app.use('/api/auth', users_1.default);
app.use('/', (req, res) => {
    res.send('Welcome to note app server');
});
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, 'Endpoint not found'));
});
// error middleware
app.use(errorHandler_1.default);
exports.default = app;
