import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetUsers, apiOffboardUser } from '../../services/api';

const ROLES = { 1: 'Admin TI', 2: 'Líder de Área', 3: 'Empleado' };

export default function Usuarios() {
  const navigate = useNavigate();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGetUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOffboard = async (id, nombre) => {
    if (!confirm(`¿Dar de baja a ${nombre}? Se revocarán sus accesos.`)) return;
    try {
      await apiOffboardUser(id);
      await fetchUsers();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-0.5">Control de empleados y roles</p>
        </div>
        <button
          onClick={() => navigate('/admin/usuarios/nuevo-usuario')}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          + Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-sm">
          Error al cargar usuarios: {error}
        </div>
      )}

      {/* ── TABLA — visible en md en adelante ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">Nombre</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Rol</th>
                <th className="text-left px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-sm">
                    Cargando usuarios...
                  </td>
                </tr>
              )}
              {!loading && users.map(u => {
                const activo = u.rol_id !== null;
                return (
                  <tr
                    key={u.id}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${!activo ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700">{u.nombre}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {ROLES[u.rol_id] ?? 'Sin rol'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        activo ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-400'
                      }`}>
                        {activo ? 'Activo' : 'Baja'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => navigate(`/admin/usuarios/${u.id}/accesos`)}
                          className="text-xs text-brand-500 hover:underline cursor-pointer"
                        >
                          Ver accesos
                        </button>
                        {activo && (
                          <button
                            onClick={() => handleOffboard(u.id, u.nombre)}
                            className="text-xs text-rose-400 hover:underline cursor-pointer"
                          >
                            Dar de baja
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && users.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-sm">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CARDS — visible solo en móvil ── */}
      <div className="md:hidden space-y-3">
        {loading && (
          <p className="text-center text-slate-400 text-sm py-8">Cargando usuarios...</p>
        )}
        {!loading && users.length === 0 && !error && (
          <p className="text-center text-slate-400 text-sm py-8">No hay usuarios registrados</p>
        )}
        {!loading && users.map(u => {
          const activo = u.rol_id !== null;
          return (
            <div
              key={u.id}
              className={`bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-2 ${!activo ? 'opacity-50' : ''}`}
            >
              {/* Fila 1: nombre + estado */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-700 text-sm">{u.nombre}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  activo ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-400'
                }`}>
                  {activo ? 'Activo' : 'Baja'}
                </span>
              </div>
              {/* Fila 2: email */}
              <p className="text-xs text-slate-400 truncate">{u.email}</p>
              {/* Fila 3: rol + acciones */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {ROLES[u.rol_id] ?? 'Sin rol'}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/usuarios/${u.id}/accesos`)}
                    className="text-xs text-brand-500 hover:underline cursor-pointer"
                  >
                    Ver accesos
                  </button>
                  {activo && (
                    <button
                      onClick={() => handleOffboard(u.id, u.nombre)}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Dar de baja
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}