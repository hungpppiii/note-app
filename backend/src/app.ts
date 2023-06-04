import 'dotenv/config';
import express, { Express } from 'express';
import errorHandler from './middlewares/errorHandler';
import morgan from 'morgan';
import noteRoutes from './routes/notes';
import userRoutes from './routes/users';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import createHttpError from 'http-errors';
import env from './utils/validateEnv';
import requiresAuth from './middlewares/auth';
import cors from 'cors';

const app: Express = express();

const redisClient = createClient({ url: env.REDIS_URL });

redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'note_app:',
});

const sessionOptions: session.SessionOptions = {
    secret: env.SESSION_SECRET,
    cookie: {
        maxAge: 60 * 60 * 1000,
        // cookie same site, comment this line if you are on the same site
        sameSite: env.NODE_ENV === 'production' ? 'none' : false,
    },
    saveUninitialized: false,
    store: redisStore,
    resave: false,
    rolling: true,
};

if (env.NODE_ENV === 'production' && sessionOptions.cookie !== undefined) {
    app.set('trust proxy', 1); // trust first proxy
    sessionOptions.cookie.secure = true; // serve secure cookies
}

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

app.use(session(sessionOptions));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(morgan('combined'));

// config routes
app.use('/api/notes', requiresAuth, noteRoutes);
app.use('/api/auth', userRoutes);
app.use('/', (req, res) => {
    res.send('Welcome to note app server');
});

app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found'));
});

// error middleware
app.use(errorHandler);

export default app;
