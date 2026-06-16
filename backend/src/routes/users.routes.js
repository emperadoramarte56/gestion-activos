import { Router } from 'express';
import { getAllUsers, createUser, getUserAccess, offboardUser } from '../controllers/users.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole, checkUserAccess } from '../middlewares/role.middleware.js';

const router = Router();

// Rutas generales de usuarios
router.get('/', verifyToken, checkRole([1, 2]), getAllUsers);
router.post('/', verifyToken, checkRole([1]), createUser);

// --- NUEVOS ENDPOINTS ---
// Usamos checkUserAccess para permitir que el empleado consulte SU propio perfil
// pero siga protegiendo el acceso a los perfiles de otros
router.get('/:id/access', verifyToken, checkUserAccess, getUserAccess);

// Solo Admin (rol 1) puede dar de baja
router.patch('/:id/offboard', verifyToken, checkRole([1]), offboardUser);

export default router;