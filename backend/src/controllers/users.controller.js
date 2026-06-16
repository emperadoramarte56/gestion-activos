import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    const { nombre, email, password, rol_id } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const id = await UserModel.create(nombre, email, hashedPassword, rol_id);
        res.status(201).json({ message: "Usuario creado exitosamente", userId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserAccess = async (req, res) => {
    const { id } = req.params;
    try {
        const accessList = await UserModel.findAssignments(id);
        res.json({ usuario_id: id, accesos_activos: accessList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const offboardUser = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Conseguir qué tiene asignado ANTES de quitarle los permisos (auditoría de bajas)
        const activeAccess = await UserModel.findAssignments(id);
        
        // 2. Desactivar la cuenta del usuario en el sistema
        const success = await UserModel.deactivateUser(id);
        
        if (!success) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.json({
            message: "Proceso de Offboarding completado con éxito. Sesión del usuario revocada.",
            usuario_desactivado_id: id,
            licencias_pendientes_por_recuperar_manualmente: activeAccess
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};