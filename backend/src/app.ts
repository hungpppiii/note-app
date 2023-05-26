import 'dotenv/config';
import express, { Express } from 'express';
import errorHandler from './middlewares/errorHandler';
import morgan from 'morgan';
import noteRoutes from './routes/notes';

const app: Express = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(morgan('combined'));

// config routes
app.use('/api/notes', noteRoutes);

app.use(errorHandler);

export default app;
