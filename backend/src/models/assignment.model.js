import db from '../config/db.js';

export const AssignmentModel = {
    create: async (usuario_id, activo_id, clave_asignada, connection = db) => {
        const [result] = await connection.execute(
            'INSERT INTO asignaciones (usuario_id, activo_id, clave_asignada) VALUES (?, ?, ?)',
            [usuario_id, activo_id, clave_asignada]
        );
        return result.insertId;
    }
};