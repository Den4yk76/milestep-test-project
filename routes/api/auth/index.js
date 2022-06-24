import { Router } from 'express';
import guard from '../../../middlewares/guard';
import {
  registration,
  login,
  logout,
  verification,
  repeatVerificationEmail,
} from '../../../controllers/auth';
import {
  validateSignUp,
  validateLogin,
  validateResendVerifySchema,
} from './validation';

const router = new Router();

router.post('/signup', validateSignUp, registration);
router.post('/login', validateLogin, login);
router.post('/logout', guard, logout);

router.get('/verify/:confirmationToken', verification);
router.post('/verify', validateResendVerifySchema, repeatVerificationEmail);

export default router;
