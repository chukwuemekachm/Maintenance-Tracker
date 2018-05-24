import express from 'express';
import AdminController from '../controllers/adminController';
import authenticateAdmin from '../middlewares/authAdmin';

const router = express.Router();

router.get('/', authenticateAdmin, AdminController.getRequests);

router.all('*', (req, res) => res.status(404).json({
  status: 'error',
  code: 404,
  message: 'Route not supported on server.',
}));

export default router;
