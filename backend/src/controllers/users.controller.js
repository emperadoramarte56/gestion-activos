import { UserModel } from '../models/user.model.js';
import { AssignmentModel } from '../models/assignment.model.js'; // 🆕 importar
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
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const activeAccess = await UserModel.findAssignments(id);

    const success = await UserModel.deactivateUser(id, connection);
    if (!success) {
      await connection.rollback();
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const licenciasVencidas = await AssignmentModel.expireByUser(id, connection);

    await connection.commit();
    res.json({
      message: "Offboarding completado. Sesión y licencias revocadas.",
      usuario_desactivado_id: id,
      licencias_vencidas: licenciasVencidas,
      detalle_licencias: activeAccess
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error en offboarding", error: error.message });
  } finally {
    connection.release();
  }
};