import { errorHandler } from './middlewares/errorHandler';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sequelize from './config/db.config';
import v1Router from './controllers/v1';

const app = express();

sequelize
  .sync()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(`/${process.env.API_VERSION}`, v1Router);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

export default app;
