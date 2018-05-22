import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Auth from './Server/routes/authRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({
  status: 'success',
  code: 200,
  message: 'Welcome to Maintenance Tracker',
}));

app.use('/api/v1/auth', Auth);

app.all('*', (req, res) => res.status(404).json({
  status: 'error',
  code: 404,
  message: 'Route not supported on server.',
}));

app.listen(port);

export const server = app;
