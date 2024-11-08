import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkPartnerAccess } from '../middlewares/checkPartnerAccess';

const router = Router();

router.get('/dashboard', authMiddleware, checkPartnerAccess, getDashboardData);

export default router;
