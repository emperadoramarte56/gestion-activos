import db from '../config/db.js';

export const AssetModel = {
    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM activos');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM activos WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (nombre, tipo, stock) => {
        const [result] = await db.execute(
            'INSERT INTO activos (nombre, tipo, stock) VALUES (?, ?, ?)',
            [nombre, tipo, stock]
        );
        return result.insertId;
    },
    update: async (id, nombre, tipo, stock) => {
        await db.execute(
            'UPDATE activos SET nombre = ?, tipo = ?, stock = ? WHERE id = ?',
            [nombre, tipo, stock, id]
        );
    },
    delete: async (id) => {
        await db.execute('DELETE FROM activos WHERE id = ?', [id]);
    },
    updateStock: async (id, nuevoStock, connection = db) => {
        await connection.execute('UPDATE activos SET stock = ? WHERE id = ?', [nuevoStock, id]);
    }
};