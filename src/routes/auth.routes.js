import { Router } from 'express';
import {
  login,
  register,
  refreshToken,
  logout,
} from '../controller/auth.controller.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
