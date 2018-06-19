import express from 'express';
import UserController from '../controllers/userController';
import { signup, login } from '../middlewares/validation';
import signupCheck from '../middlewares/checkUser';
import authenticateUser from '../middlewares/userAuthentication';
import { validateNewPassword, comparePasswords } from '../middlewares/validateUserPassword';

const router = express.Router();

router.post('/signup', signup, signupCheck, UserController.signUp);
router.post('/login', login, UserController.login);
router.get('/account', authenticateUser, UserController.userProfile);
router.put('/changepassword', authenticateUser, validateNewPassword, comparePasswords, UserController.updatePassword);

export default router;
