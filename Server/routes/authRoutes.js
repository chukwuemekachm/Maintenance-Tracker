import express from 'express';
import UserController from '../controllers/userController';
import { signup, login } from '../middlewares/validation';
import signupCheck from '../middlewares/checkUser';

const router = express.Router();

router.post('/signup', signup, signupCheck, UserController.signUp);
router.post('/login', login, UserController.login);

export default router;
