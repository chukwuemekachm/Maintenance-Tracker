import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import AuthRoutes from './Server/routes/authRoutes';
import UserRoutes from './Server/routes/userRoutes';
import AdminRoutes from './Server/routes/adminRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/requests', AdminRoutes);
app.get('/api/v1/docs', (req, res) => res.redirect('https://maintenancetracker1.docs.apiary.io/#'));
app.use('/', express.static('public'));

app.all('*', (req, res) => res.status(404).json({
  status: 'error',
  code: 404,
  message: 'Route unavailable on server.',
}));

app.listen(port);

export const server = app;
export default app;
