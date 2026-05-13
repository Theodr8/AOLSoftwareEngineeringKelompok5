import { Router } from 'express';
import authRoutes from './authRoutes';
// import userRoutes from './userRoutes';
// import postRoutes from './postRoutes';

const router = Router();

// Semua rute Auth akan berawalan /api/auth

router.get('/', (req, res) => {
  res.json({ message: "Selamat datang di API Sistem Saya! 🚀" });
});

router.use('/auth', authRoutes);

// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

export default router;