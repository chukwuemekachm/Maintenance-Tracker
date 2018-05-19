import express from 'express';
import User from '../controllers/userController';

const router = express.Router();
const UserController = new User();

router.get('/requests', UserController.getRequest);
router.get('/requests/:id', UserController.getRequestById);

router.all('*', (req, res) => res.status(404).json({
  status: 'fail',
  code: 404,
  message: 'Route not supported on server.',
}));

export default router;
