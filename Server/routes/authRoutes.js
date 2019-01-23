import express from 'express';
import AuthController from '../controllers/AuthController';
import { signup, login } from '../middlewares/validation';
import signupCheck from '../middlewares/checkUser';
import authenticateUser from '../middlewares/userAuthentication';
import {
  validateNewPassword,
  comparePasswords,
} from '../middlewares/validateUserPassword';
import {
  validateUserProfile,
  processUpdatedProfile,
} from '../middlewares/validateUserUpdateProfile';

const router = express.Router();

router.post('/signup', signup, signupCheck, AuthController.signup);
router.post('/login', login, AuthController.login);
router.get('/account', authenticateUser, AuthController.getProfile);
router.put(
  '/account',
  authenticateUser,
  validateUserProfile,
  processUpdatedProfile,
  AuthController.updateProfile,
);
router.put(
  '/changepassword',
  authenticateUser,
  validateNewPassword,
  comparePasswords,
  AuthController.updatePassword,
);

export default router;
