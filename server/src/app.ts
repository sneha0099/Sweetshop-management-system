import express from 'express';
import helmet from 'helmet';
import sweetRoutes from './routes/sweet.route';
import userRoutes from './routes/user.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './utils/constants';

const app = express();

app.use(cors(corsOptions));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (_req, res) => {
  res.send('Sweet Shop API is running');
});

app.use('/api/auth', userRoutes);
app.use('/api/sweets', sweetRoutes);

export default app;
