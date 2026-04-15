import { Router } from 'express';
import {
  login,
  register,
  refreshToken,
  logout,
} from '../controller/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
