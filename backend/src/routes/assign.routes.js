import { Router } from 'express';
import { assignAssetToUser } from '../controllers/assign.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();
router.post('/', verifyToken, checkRole([1, 2]), assignAssetToUser);
export default router;