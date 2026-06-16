import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mensaje en consola para confirmar si conectó bien en Windows
pool.getConnection()
    .then(connection => {
        console.log('✅ Base de datos MySQL conectada en entorno local Windows.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error crítico de conexión a MySQL:', err.message);
    });

export default pool;