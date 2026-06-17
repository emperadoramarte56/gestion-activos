import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetSolicitudes, apiUpdateSolicitud } from '../services/api';

const ESTADO_STYLE = {
  'Pendiente': 'bg-amber-100 text-amber-500',
  'Aprobada':  'bg-emerald-100 text-emerald-600',
  'Rechazada': 'bg-rose-100 text-rose-400',
};

export default function Solicitudes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin  = user?.rol_id === 1;

  const [solicitudes, setSolicitudes] = useState([]);
  const [filter,      setFilter]      = useState('Todos');
  const [loading,     setLoading]     = useState(true);

  const loadData = async () => {
    try {
      const data = await apiGetSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      console.error('Error cargando solicitudes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleEstado = async (solicitud, nuevoEstado) => {
    if (nuevoEstado === 'Aprobada') {
      navigate(`/admin/usuarios/${solicitud.empleado_id}/accesos?solicitud_id=${solicitud.id}&activo_id=${solicitud.activo_id}`);
    } else {
      try {
        await apiUpdateSolicitud(solicitud.id, nuevoEstado);
        loadData();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const filtered = filter === 'Todos'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filter);

  if (loading) return <div className="p-6 text-slate-400 text-sm">Cargando...</div>;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Solicitudes de licencias</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {isAdmin ? 'Revisa y aprueba las solicitudes' : 'Historial de tus solicitudes'}
        </p>
      </div>

      {!isAdmin && (
        <div className="bg-sky-50 border-l-4 border-sky-400 p-3 rounded-r-lg">
          <p className="text-xs text-sky-700">
            <strong>¿Necesitas algo nuevo?</strong> Puedes crear nuevas solicitudes desde el apartado{' '}
            <strong>"Mi Equipo"</strong> seleccionando a un empleado.
          </p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['Todos', 'Pendiente', 'Aprobada', 'Rechazada'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border ${
              filter === f
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── TABLA — visible en md en adelante ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3">Empleado</th>
                <th className="text-left px-5 py-3">Licencia</th>
                <th className="text-left px-5 py-3">Solicitante</th>
                <th className="text-left px-5 py-3">Estado</th>
                {isAdmin && <th className="px-5 py-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">{s.empleado_nombre}</td>
                  <td className="px-5 py-3">{s.activo_nombre}</td>
                  <td className="px-5 py-3">{s.manager_nombre}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_STYLE[s.estado]}`}>
                      {s.estado}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3">
                      {s.estado === 'Pendiente' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEstado(s, 'Aprobada')}
                            className="text-xs text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleEstado(s, 'Rechazada')}
                            className="text-xs text-rose-400 border border-rose-200 hover:bg-rose-50 px-2 py-1 rounded cursor-pointer"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-5 py-8 text-center text-slate-400 text-sm">
                    Sin solicitudes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CARDS — visible solo en móvil ── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">Sin solicitudes</p>
        )}
        {filtered.map(s => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-2">
            {/* Fila 1: empleado + estado */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-700 text-sm">{s.empleado_nombre}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_STYLE[s.estado]}`}>
                {s.estado}
              </span>
            </div>
            {/* Fila 2: licencia */}
            <p className="text-xs text-slate-500">
              <span className="text-slate-400">Licencia: </span>{s.activo_nombre}
            </p>
            {/* Fila 3: solicitante */}
            <p className="text-xs text-slate-500">
              <span className="text-slate-400">Solicitante: </span>{s.manager_nombre}
            </p>
            {/* Fila 4: acciones admin */}
            {isAdmin && s.estado === 'Pendiente' && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleEstado(s, 'Aprobada')}
                  className="flex-1 text-xs text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-2 py-1.5 rounded cursor-pointer"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleEstado(s, 'Rechazada')}
                  className="flex-1 text-xs text-rose-400 border border-rose-200 hover:bg-rose-50 px-2 py-1.5 rounded cursor-pointer"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}