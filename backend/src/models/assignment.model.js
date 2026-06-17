import db from '../config/db.js';

export const AssignmentModel = {

  // Ahora acepta fecha_vencimiento opcional
  create: async (usuario_id, activo_id, clave_asignada, fecha_vencimiento = null, connection = db) => {
    const [result] = await connection.execute(
      `INSERT INTO asignaciones (usuario_id, activo_id, clave_asignada, fecha_vencimiento) 
       VALUES (?, ?, ?, ?)`,
      [usuario_id, activo_id, clave_asignada, fecha_vencimiento]
    );
    return result.insertId;
  },

  // Verificar duplicado activo
  findDuplicate: async (usuario_id, activo_id, connection = db) => {
    const [rows] = await connection.execute(
      `SELECT id FROM asignaciones 
       WHERE usuario_id = ? AND activo_id = ? AND estado = 'Activa'
       LIMIT 1`,
      [usuario_id, activo_id]
    );
    return rows[0];
  },

  // Vencer todas las licencias activas de un usuario al dar de baja
  expireByUser: async (usuario_id, connection = db) => {
    const [result] = await connection.execute(
      `UPDATE asignaciones 
       SET estado = 'Vencida', fecha_vencimiento = NOW()
       WHERE usuario_id = ? AND estado = 'Activa'`,
      [usuario_id]
    );
    return result.affectedRows;
  },

};