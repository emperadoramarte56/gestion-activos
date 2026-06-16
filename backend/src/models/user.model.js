import db from '../config/db.js';

export const UserModel = {
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id, connection = db) => {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT id, nombre, email, rol_id, estado FROM usuarios'); // Añadido 'estado' por si lo listan
        return rows;
    },

    create: async (nombre, email, password, rol_id) => {
        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, email, password, rol_id, estado) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, password, rol_id, 'Activo'] // Asegura que se cree activo
        );
        return result.insertId;
    },

    // Obtener las licencias y activos que tiene un usuario específico actualmente
    findAssignments: async (userId) => {
        const [rows] = await db.execute(
            `SELECT a.id as asignacion_id, ac.nombre as activo_nombre, ac.tipo, a.clave_asignada, a.fecha_asignacion 
             FROM asignaciones a
             JOIN activos ac ON a.activo_id = ac.id
             WHERE a.usuario_id = ?`, 
            [userId]
        );
        return rows;
    },

    // Dar de baja el rol del usuario (Simulación de desactivación / eliminación lógica)
    deactivateUser: async (userId) => {
        // Mantiene tu lógica de quitar rol y además le ponemos estado Baja en MySQL
        const [result] = await db.execute('UPDATE usuarios SET rol_id = NULL, estado = "Baja" WHERE id = ?', [userId]);
        return result.affectedRows > 0;
    }
};