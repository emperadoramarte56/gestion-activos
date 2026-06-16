import { Router } from 'express';
import { getAllAssets, createAsset, updateAsset, deleteAsset } from '../controllers/assets.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';
import { validateAsset } from '../middlewares/validate.middleware.js';

const router = Router();
router.get('/',    verifyToken, getAllAssets);
router.post('/',   verifyToken, checkRole([1]), validateAsset, createAsset);
router.put('/:id', verifyToken, checkRole([1]), updateAsset);
router.delete('/:id', verifyToken, checkRole([1]), deleteAsset);
export default router;