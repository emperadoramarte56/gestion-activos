import db from '../config/db.js';

export const getSolicitudes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, e.nombre as empleado_nombre, a.nombre as activo_nombre, u.nombre as manager_nombre
            FROM solicitudes s
            JOIN usuarios e ON s.empleado_id = e.id
            JOIN activos a ON s.activo_id = a.id
            JOIN usuarios u ON s.manager_id = u.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSolicitud = async (req, res) => {
    const { empleado_id, activo_id, manager_id } = req.body;
    try {
        await db.query(
            'INSERT INTO solicitudes (empleado_id, activo_id, manager_id, estado) VALUES (?, ?, ?, ?)',
            [empleado_id, activo_id, manager_id, 'Pendiente']
        );
        res.json({ message: 'Solicitud creada con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSolicitud = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await db.query('UPDATE solicitudes SET estado = ? WHERE id = ?', [estado, id]);
        res.json({ message: 'Solicitud actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};