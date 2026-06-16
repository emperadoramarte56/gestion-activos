import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRoutes from './routes/dashboard.routes.js';
import authRoutes from './routes/auth.routes.js';
import assetsRoutes from './routes/assets.routes.js';
import usersRoutes from './routes/users.routes.js';
import assignRoutes from './routes/assign.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/assignments', assignRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint no encontrado en la API" });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend activo en: http://localhost:${PORT}`);
    console.log(`🖥️  Panel web de pruebas disponible en: http://localhost:${PORT}/test-panel/`);
});