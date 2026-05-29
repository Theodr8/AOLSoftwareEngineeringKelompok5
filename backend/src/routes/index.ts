import { Router } from 'express';
import authRoutes from './authRoutes';
import postRoutes from './postRoutes';
import userRoutes from './userRoutes';
import jobRoutes from './jobRoutes';
import messageRoutes from './messageRoutes';
import projectRoutes from './projectRoutes';
import searchRoute from './searchRoute';
const router = Router();

// Semua rute akan berawalan /api

router.get('/', (req, res) => {
  res.json({ message: "Selamat datang di API Sistem Saya!" });
});

// --- CONTOH RUTE YANG DILINDUNGI ---
// Perhatikan kita meletakkan 'requireAuth' di tengah, sebelum fungsi Response (Controller)
// router.get('/users/me', requireAuth, async (req: AuthRequest, res: Response) => {
//   // Karena sudah lewat satpam, kita pasti punya req.user
//   const userId = req.user.userId; 

//   res.json({
//     message: "Selamat datang di area rahasia!",
//     userIdAnda: userId
//   });
// });

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/chat', messageRoutes);
router.use('/projects', projectRoutes);
router.use('/search', searchRoute);


export default router;