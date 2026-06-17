import db from '../config/db.js';

export const AssignmentModel = {

  // Crear asignación — igual que antes
  create: async (usuario_id, activo_id, clave_asignada, connection = db) => {
    const [result] = await connection.execute(
      'INSERT INTO asignaciones (usuario_id, activo_id, clave_asignada) VALUES (?, ?, ?)',
      [usuario_id, activo_id, clave_asignada]
    );
    return result.insertId;
  },

  // 🆕 Verificar si un usuario YA tiene asignada esa licencia activa
  findDuplicate: async (usuario_id, activo_id, connection = db) => {
    const [rows] = await connection.execute(
      `SELECT id FROM asignaciones 
       WHERE usuario_id = ? AND activo_id = ? AND estado = 'Activa'
       LIMIT 1`,
      [usuario_id, activo_id]
    );
    return rows[0]; // undefined si no existe, objeto si ya tiene la licencia
  },

  // 🆕 Vencer TODAS las licencias activas de un usuario al dar de baja
  expireByUser: async (usuario_id, connection = db) => {
    const [result] = await connection.execute(
      `UPDATE asignaciones 
       SET estado = 'Vencida', fecha_vencimiento = NOW()
       WHERE usuario_id = ? AND estado = 'Activa'`,
      [usuario_id]
    );
    return result.affectedRows; // cuántas licencias se vencieron
  },

};