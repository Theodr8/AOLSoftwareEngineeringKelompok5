import { Router } from 'express';
import authRoutes from './authRoutes';
import postRoutes from './postRoutes';
import userRoutes from './userRoutes';
import jobRoutes from './jobRoutes';
import messageRoutes from './messageRoutes';
import projectRoutes from './projectRoutes';
import searchRoute from './searchRoute';
import skillRoutes from './skillRoutes';
import tagRoute from './tagRoute';

const router = Router();

// Semua rute akan berawalan /api

router.get('/', (req, res) => {
  res.json({ message: "Selamat datang di API Sistem Saya!" });
});

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/chat', messageRoutes);
router.use('/projects', projectRoutes);
router.use('/tags', tagRoute);
router.use('/search', searchRoute);
router.use('/skill', skillRoutes);
// router.use('/jobs', jobRoutes);


export default router;