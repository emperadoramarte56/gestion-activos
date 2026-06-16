import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate
import { useAuth } from '../context/AuthContext';
import { apiGetSolicitudes, apiUpdateSolicitud } from '../services/api';

const ESTADO_STYLE = {
  'Pendiente': 'bg-amber-100 text-amber-500',
  'Aprobada':  'bg-emerald-100 text-emerald-600',
  'Rechazada': 'bg-rose-100 text-rose-400',
};

export default function Solicitudes() {
  const { user } = useAuth();
  const navigate = useNavigate(); // 2. Inicializamos navigate
  const isAdmin  = user?.rol_id === 1;

  const [solicitudes, setSolicitudes] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await apiGetSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      console.error("Error cargando solicitudes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

const handleEstado = async (solicitud, nuevoEstado) => {
  if (nuevoEstado === 'Aprobada') {
    // Pasamos el id de la solicitud y el id del activo solicitado
    navigate(`/admin/usuarios/${solicitud.empleado_id}/accesos?solicitud_id=${solicitud.id}&activo_id=${solicitud.activo_id}`);
  } else {
    try {
      await apiUpdateSolicitud(solicitud.id, nuevoEstado);
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }
};

  const filtered = filter === 'Todos'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filter);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Solicitudes de licencias</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {isAdmin ? 'Revisa y aprueba las solicitudes' : 'Historial de tus solicitudes'}
        </p>
      </div>

      {!isAdmin && (
        <div className="bg-sky-50 border-l-4 border-sky-400 p-3 rounded-r-lg">
          <p className="text-xs text-sky-700">
            <strong>¿Necesitas algo nuevo?</strong> Puedes crear nuevas solicitudes desde el apartado <strong>"Mi Equipo"</strong> seleccionando a un empleado.
          </p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {['Todos', 'Pendiente', 'Aprobada', 'Rechazada'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border ${filter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
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
              <tr key={s.id} className="border-b border-slate-50">
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
                        {/* 4. Pasamos el objeto solicitud completo en lugar de solo el ID */}
                        <button onClick={() => handleEstado(s, 'Aprobada')} className="text-xs text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer">Aprobar</button>
                        <button onClick={() => handleEstado(s, 'Rechazada')} className="text-xs text-rose-400 border border-rose-200 hover:bg-rose-50 px-2 py-1 rounded cursor-pointer">Rechazar</button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}