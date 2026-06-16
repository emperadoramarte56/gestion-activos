import { UserModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findByEmail(email);
        if (!user) return res.status(401).json({ message: "Usuario o contraseña incorrectos." });

        const isMatch = password === user.password || await bcrypt.compare(password, user.password).catch(() => false);
        if (!isMatch) return res.status(401).json({ message: "Usuario o contraseña incorrectos." });

        const token = jwt.sign(
            { id: user.id, rol_id: user.rol_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: "Autenticación exitosa",
            token,
            user: { id: user.id, nombre: user.nombre, rol_id: user.rol_id }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};