import 'dotenv/config';
import 'reflect-metadata';
import '@shared/container';
import '@shared/infra/typeorm';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import uploadConfig from '@config/uploadConfig';
import errorHandling from './middlewares/errorHandling';
import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);

app.use(routes);

app.use(errors());

routes.use(errorHandling);

app.listen(3333, () => {
  console.log('🚀 SERVER STARTED ON 3333');
});
