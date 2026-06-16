export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "No autenticado." });
        
        // Convertimos a número por seguridad para evitar errores de comparación
        if (!allowedRoles.includes(Number(req.user.rol_id))) {
            return res.status(403).json({ message: "No tienes los permisos requeridos para esta acción." });
        }
        next();
    };
};

export const checkUserAccess = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado." });

    // 1. Los Administradores (rol 1) y Managers (rol 2) pueden ver cualquier usuario
    if (req.user.rol_id === 1 || req.user.rol_id === 2) {
        return next();
    }

    // 2. Los Empleados (rol 3) solo pueden ver sus propios datos
    // Comparamos el ID del token (req.user.id) con el ID de la URL (req.params.id)
    if (String(req.user.id) === String(req.params.id)) {
        return next();
    }

    // Si no es admin/manager y el ID no coincide, denegamos
    return res.status(403).json({ message: "No tienes permiso para acceder a este recurso." });
};