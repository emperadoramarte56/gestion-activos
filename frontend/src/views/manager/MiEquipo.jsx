import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetUsers, apiGetAssets, apiGetUserAccess, apiCreateRequest } from '../../services/api';

export default function MiEquipo() {
  const { user } = useAuth();
  const [equipo, setEquipo] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [accesos, setAccesos] = useState([]); // Activos actuales del usuario
  const [form, setForm] = useState({ activo_id: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [users, availableAssets] = await Promise.all([
          apiGetUsers(),
          apiGetAssets(),
        ]);
        setEquipo(users.filter(u => u.rol_id !== 1 && u.rol_id !== null));
        setAssets(availableAssets.filter(a => a.stock > 0));
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectUser = async (u) => {
    setSelected(u);
    setFeedback('');
    setForm({ activo_id: '' });
    try {
      // IMPORTANTE: Asegúrate de que esta función en api.js 
      // realmente llame a la ruta correcta (ej: /api/users/:id/access)
      const data = await apiGetUserAccess(u.id);
      setAccesos(data.accesos_activos || []);
    } catch (err) {
      console.error("Error al cargar accesos:", err);
      setAccesos([]);
    }
  };

  const handleRequest = async () => {
    if (!form.activo_id) {
      setFeedback('Selecciona un activo para solicitar.');
      return;
    }
    setSubmitting(true);
    setFeedback('');
    try {
      await apiCreateRequest({
        empleado_id: selected.id,
        activo_id: +form.activo_id,
        manager_id: user.id
      });
      setFeedback('✓ Solicitud enviada al Admin correctamente.');
      setForm({ activo_id: '' });
    } catch (err) {
      setFeedback(`Error: ${err.message || 'No se pudo enviar la solicitud'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Cargando equipo...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Mi Equipo</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gestión de personal y solicitudes de activos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {equipo.map(u => (
          <div key={u.id} onClick={() => handleSelectUser(u)} className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${selected?.id === u.id ? 'border-brand-400 ring-2 ring-brand-100' : 'border-slate-200 hover:border-brand-200'}`}>
             <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-brand-600 font-bold text-sm">{u.nombre[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">{u.nombre}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
             </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-200">
          {/* Seccion de Licencias Actuales */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Licencias actuales de {selected.nombre}</h2>
            {accesos.length > 0 ? (
              <div className="space-y-2">
                {accesos.map((a, i) => (
                  <div key={i} className="px-3 py-2 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100 flex justify-between">
                    <span>{a.activo_nombre}</span>
                    <span className="font-mono text-slate-400">{a.clave_asignada || 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No tiene licencias asignadas.</p>
            )}
          </div>

          {/* Formulario de Nueva Solicitud */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Solicitar Nueva Licencia</h2>
            <select
              value={form.activo_id}
              onChange={e => setForm({ activo_id: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white"
            >
              <option value="">Seleccionar activo...</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.nombre} ({a.stock} disponibles)</option>
              ))}
            </select>
            
            {feedback && (
              <p className={`text-xs rounded-lg px-3 py-2 ${feedback.startsWith('✓') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-400 border border-rose-100'}`}>
                {feedback}
              </p>
            )}

            <button
              onClick={handleRequest}
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}