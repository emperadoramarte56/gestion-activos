import db from '../config/db.js';
import { AssetModel } from '../models/asset.model.js';
import { AssignmentModel } from '../models/assignment.model.js';
import { UserModel } from '../models/user.model.js'; // 🚨 1. IMPORTANTE: Importen su modelo de usuarios

export const assignAssetToUser = async (req, res) => {
    const { usuario_id, activo_id, clave_asignada } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // ====================================================================
        // 🚨 CANDADO DE SEGURIDAD: CONTROL DE USUARIO DADO DE BAJA
        // ====================================================================
        // 2. Buscamos al usuario en la base de datos
        const user = await UserModel.findById(usuario_id); 
        
        if (!user) {
            await connection.rollback();
            return res.status(404).json({ message: "El usuario seleccionado no existe." });
        }

        // 3. Validamos si su estado es 'Baja' (sin importar mayúsculas o minúsculas)
        if (user.estado && user.estado.toLowerCase().trim() === 'baja') {
            await connection.rollback();
            return res.status(400).json({ 
                message: "No se pueden asignar licencias o activos a un usuario que se encuentra dado de BAJA." 
            });
        }
        // ====================================================================

        const asset = await AssetModel.findById(activo_id);
        if (!asset) {
            await connection.rollback();
            return res.status(404).json({ message: "El activo no existe." });
        }

        if (asset.stock <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: "No queda stock disponible para este activo." });
        }

        await AssignmentModel.create(usuario_id, activo_id, clave_asignada, connection);
        await AssetModel.updateStock(activo_id, asset.stock - 1, connection);

        await connection.commit();
        res.status(201).json({ message: "Asignación realizada con éxito y stock descontado." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Error en la transacción", error: error.message });
    } finally {
        connection.release();
    }
};