import express from 'express';
import RequestController from '../controllers/requestController';
import authenticateUser from '../middlewares/auth';

const router = express.Router();

router.get('/requests', authenticateUser, RequestController.getUserRequests);

router.all('*', (req, res) => res.status(404).json({
  status: 'error',
  code: 404,
  message: 'Route not supported on server.',
}));

export default router;
