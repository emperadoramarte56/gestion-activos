import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Obtenemos el encabezado de autorización
    const authHeader = req.headers['authorization'];

    // Verificamos si existe el encabezado
    if (!authHeader) {
        return res.status(403).json({ message: "Acceso denegado. Token faltante." });
    }

    // El formato esperado es "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Acceso denegado. Formato de token inválido." });
    }

    try {
        // Verificar el token (asegúrate que tu variable de entorno se llame igual)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};