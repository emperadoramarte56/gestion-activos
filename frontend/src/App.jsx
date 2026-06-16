import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';

import Login          from './views/auth/Login';
import Dashboard      from './views/admin/Dashboard';
import Inventario     from './views/admin/Inventario';
import NuevaLicencia  from './views/admin/NuevaLicencia';
import EditarLicencia from './views/admin/EditarLicencia';
import Usuarios       from './views/admin/Usuarios';
import NuevoUsuario   from './views/admin/NuevoUsuario';
import AccesosUsuario from './views/admin/AccesosUsuario';
import MiEquipo       from './views/manager/MiEquipo';
import Solicitudes    from './views/Solicitudes'; // IMPORTANTE: Importar el componente
import MisActivos     from './views/empleado/MisActivos';
import NotFound       from './views/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"      element={<Navigate to="/login" replace />} />

          {/* ── Admin TI (rol_id: 1) ─────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={[1]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index                        element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"             element={<Dashboard />} />
            <Route path="inventario"            element={<Inventario />} />
            <Route path="inventario/nueva-licencia"         element={<NuevaLicencia />} />
            <Route path="inventario/editar-licencia/:id"  element={<EditarLicencia />} />
            <Route path="usuarios"              element={<Usuarios />} />
            <Route path="usuarios/nuevo-usuario"          element={<NuevoUsuario />} />
            <Route path="usuarios/:id/accesos"            element={<AccesosUsuario />} />
            <Route path="solicitudes"           element={<Solicitudes />} /> {/* RUTA NUEVA */}
          </Route>

          {/* ── Manager (rol_id: 2) ──────────────────────────── */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={[2]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index              element={<Navigate to="mi-equipo" replace />} />
            <Route path="mi-equipo"   element={<MiEquipo />} />
            <Route path="solicitudes" element={<Solicitudes />} /> {/* RUTA NUEVA */}
          </Route>

          {/* ── Empleado (rol_id: 3) ─────────────────────────── */}
          <Route
            path="/empleado"
            element={
              <ProtectedRoute roles={[3]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index                 element={<Navigate to="mis-activos" replace />} />
            <Route path="mis-activos"    element={<MisActivos />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}