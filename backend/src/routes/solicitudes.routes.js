import { Router } from 'express';
import { getSolicitudes, createSolicitud, updateSolicitud } from '../controllers/solicitudes.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', verifyToken, getSolicitudes);
router.post('/', verifyToken, checkRole([2]), createSolicitud); // Solo Managers crean
router.patch('/:id', verifyToken, checkRole([1]), updateSolicitud); // Solo Admins aprueban

export default router;