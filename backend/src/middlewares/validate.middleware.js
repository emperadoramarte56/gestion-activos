export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios: email y password." });
    }
    next();
};

export const validateAsset = (req, res, next) => {
    const { nombre, tipo, stock } = req.body;
    if (!nombre || !tipo || stock === undefined) {
        return res.status(400).json({ message: "Faltan campos obligatorios para el activo." });
    }
    next();
};