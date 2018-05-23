import express from 'express';
import UserController from '../controllers/userController';
import { signup, login } from '../middlewares/validation';
import signupCheck from '../middlewares/check';

const router = express.Router();

router.post('/signup', signup, signupCheck, UserController.signUp);
router.post('/login', login, UserController.login);

router.all('*', (req, res) => res.status(404).json({
  status: 'error',
  code: 404,
  message: 'Route not supported on server.',
}));

export default router;
