import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Route ini akan menjadi /api/auth/register
router.post('/register', register);

// Route ini akan menjadi /api/auth/login
router.post('/login', login);

export default router;