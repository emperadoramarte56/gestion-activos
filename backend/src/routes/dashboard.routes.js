import { Router } from 'express';
import { getDashboardSummary, getDashboardAlerts } from '../controllers/dashboard.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Ambos protegidos por Token para que solo usuarios firmados los vean
router.get('/summary', verifyToken, getDashboardSummary);
router.get('/alerts', verifyToken, getDashboardAlerts);

export default router;