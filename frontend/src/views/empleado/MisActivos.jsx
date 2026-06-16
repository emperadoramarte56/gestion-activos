import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetUserAccess } from '../../services/api';

export default function MisActivos() {
  const { user }   = useAuth();
  const [activos,  setActivos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // Estilo único para todas las etiquetas, sin importar el tipo
  const badgeStyle = "bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-0.5 rounded-full";

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await apiGetUserAccess(user.id);
        setActivos(data?.accesos_activos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
      Cargando tus activos...
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Mis Activos</h1>
        <p className="text-sm text-slate-500 mt-0.5">Licencias asignadas a {user?.nombre}</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-sm">
          Error al cargar activos: {error}
        </div>
      )}

      {!loading && activos.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-400 text-sm">No tienes licencias asignadas todavía.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activos.map(a => (
          <div key={a.asignacion_id || Math.random()} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-700 text-sm">{a.activo_nombre || 'Activo'}</h3>
              
              {/* Aplicamos el estilo constante a todos los tipos */}
              <span className={badgeStyle}>
                {a.tipo || 'General'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400">Clave / Licencia</p>
                <p className="text-xs font-mono bg-slate-50 border border-slate-100 rounded px-2 py-1.5 text-slate-600 mt-1 break-all">
                  {a.clave_asignada || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Fecha de asignación</p>
                <p className="text-xs text-slate-600 font-medium">
                  {a.fecha_asignacion 
                    ? new Date(a.fecha_asignacion).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : 'Fecha no disponible'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}