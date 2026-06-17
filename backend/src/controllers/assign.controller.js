import db from '../config/db.js';
import { AssetModel } from '../models/asset.model.js';
import { AssignmentModel } from '../models/assignment.model.js';
import { UserModel } from '../models/user.model.js';

export const assignAssetToUser = async (req, res) => {
  // 🆕 Se agrega fecha_vencimiento al destructuring
  const { usuario_id, activo_id, clave_asignada, fecha_vencimiento = null } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const user = await UserModel.findById(usuario_id, connection);
    if (!user) {
      await connection.rollback();
      return res.status(404).json({ message: "El usuario seleccionado no existe." });
    }

    if (user.estado && user.estado.toLowerCase().trim() === 'baja') {
      await connection.rollback();
      return res.status(400).json({
        message: "No se pueden asignar licencias a un usuario dado de BAJA."
      });
    }

    const asset = await AssetModel.findById(activo_id);
    if (!asset) {
      await connection.rollback();
      return res.status(404).json({ message: "El activo no existe." });
    }

    if (asset.stock <= 0) {
      await connection.rollback();
      return res.status(400).json({ message: "No queda stock disponible para este activo." });
    }

    const duplicate = await AssignmentModel.findDuplicate(usuario_id, activo_id, connection);
    if (duplicate) {
      await connection.rollback();
      return res.status(400).json({
        message: `El usuario ya tiene asignada la licencia "${asset.nombre}". No se puede asignar dos veces.`
      });
    }

    // 🆕 Se pasa fecha_vencimiento al model
    await AssignmentModel.create(usuario_id, activo_id, clave_asignada, fecha_vencimiento, connection);
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