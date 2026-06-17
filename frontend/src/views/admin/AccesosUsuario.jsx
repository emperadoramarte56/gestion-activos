import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiGetUsers, apiGetUserAccess, apiGetAssets, apiAssignAsset, apiUpdateSolicitud } from '../../services/api';

// Helper para formatear fechas
const fmtFecha = (fecha) => {
  if (!fecha) return null;
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

// Helper para saber si una fecha ya venció
const isVencida = (fecha) => {
  if (!fecha) return false;
  return new Date(fecha) < new Date();
};

export default function AccesosUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const solicitudId        = searchParams.get('solicitud_id');
  const preselectedActivoId = searchParams.get('activo_id');

  const [usuario,  setUsuario]  = useState(null);
  const [accesos,  setAccesos]  = useState([]);
  const [assets,   setAssets]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState({ activo_id: '', clave_asignada: '', fecha_vencimiento: '' });
  const [saving,   setSaving]   = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errors,   setErrors]   = useState({});

  const fetchData = async () => {
    try {
      const [users, accesosData, assetsData] = await Promise.all([
        apiGetUsers(),
        apiGetUserAccess(id),
        apiGetAssets(),
      ]);
      const found = users.find(u => u.id === +id);
      if (!found) { navigate('/admin/usuarios'); return; }
      setUsuario(found);
      setAccesos(accesosData.accesos_activos);
      setAssets(assetsData.filter(a => a.stock > 0));
      if (preselectedActivoId) {
        setForm(p => ({ ...p, activo_id: preselectedActivoId }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id, preselectedActivoId]);

  const validate = () => {
    const e = {};
    if (!form.activo_id)            e.activo_id      = 'Selecciona un activo';
    if (!form.clave_asignada.trim()) e.clave_asignada = 'Ingresa la clave';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAssign = async () => {
    if (!validate()) return;
    setSaving(true);
    setFeedback('');
    try {
      await apiAssignAsset({
        usuario_id:        +id,
        activo_id:         +form.activo_id,
        clave_asignada:    form.clave_asignada,
        // 🆕 enviar fecha o null si no se llenó
        fecha_vencimiento: form.fecha_vencimiento || null,
      });

      if (solicitudId) {
        await apiUpdateSolicitud(solicitudId, 'Aprobada');
      }

      setFeedback('✓ Licencia asignada correctamente.');
      setForm({ activo_id: '', clave_asignada: '', fecha_vencimiento: '' });
      await fetchData();

      if (solicitudId) {
        setTimeout(() => navigate('/admin/solicitudes'), 1500);
      }
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Cargando...</div>
  );

  const usuarioDadoDeBaja = usuario?.estado?.toLowerCase() === 'baja';

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
        >
          ← Volver
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Accesos de usuario</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {usuario?.nombre} — {usuario?.email}
            {/* 🆕 Badge de baja */}
            {usuarioDadoDeBaja && (
              <span className="ml-2 text-xs bg-rose-100 text-rose-400 px-2 py-0.5 rounded-full font-medium">
                Dado de baja
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Tabla de licencias asignadas */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Licencias asignadas</h2>
        </div>
        {accesos.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400 italic">
            Este usuario no tiene licencias asignadas.
          </p>
        ) : (
          <>
            {/* Tabla — md en adelante */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 font-medium">Licencia</th>
                    <th className="text-left px-5 py-3 font-medium">Tipo</th>
                    <th className="text-left px-5 py-3 font-medium">Clave</th>
                    <th className="text-left px-5 py-3 font-medium">Vencimiento</th>{/* 🆕 */}
                    <th className="text-left px-5 py-3 font-medium">Estado</th>{/* 🆕 */}
                  </tr>
                </thead>
                <tbody>
                  {accesos.map(a => {
                    const vencida = a.estado === 'Vencida' || isVencida(a.fecha_vencimiento);
                    return (
                      <tr key={a.asignacion_id} className={`border-b border-slate-50 ${vencida ? 'opacity-60' : ''}`}>
                        <td className="px-5 py-3 font-medium text-slate-700">{a.activo_nombre}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {a.tipo}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{a.clave_asignada}</td>
                        {/* 🆕 Fecha de vencimiento */}
                        <td className="px-5 py-3 text-xs text-slate-500">
                          {fmtFecha(a.fecha_vencimiento) ?? (
                            <span className="text-slate-300 italic">Sin fecha</span>
                          )}
                        </td>
                        {/* 🆕 Badge de estado */}
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            vencida
                              ? 'bg-rose-100 text-rose-400'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {vencida ? 'Vencida' : 'Activa'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards — móvil */}
            <div className="md:hidden divide-y divide-slate-100">
              {accesos.map(a => {
                const vencida = a.estado === 'Vencida' || isVencida(a.fecha_vencimiento);
                return (
                  <div key={a.asignacion_id} className={`px-4 py-3 space-y-1 ${vencida ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-medium text-slate-700 text-sm">{a.activo_nombre}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        vencida ? 'bg-rose-100 text-rose-400' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {vencida ? 'Vencida' : 'Activa'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Tipo: <span className="text-slate-600">{a.tipo}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-mono">{a.clave_asignada}</p>
                    <p className="text-xs text-slate-400">
                      Vence: <span className="text-slate-600">
                        {fmtFecha(a.fecha_vencimiento) ?? 'Sin fecha'}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Formulario asignar — oculto si usuario está dado de baja */}
      {!usuarioDadoDeBaja && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Asignar nueva licencia</h2>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Activo disponible</label>
            <select
              value={form.activo_id}
              onChange={e => setForm(p => ({ ...p, activo_id: e.target.value }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white ${
                errors.activo_id ? 'border-rose-300' : 'border-slate-200'
              }`}
            >
              <option value="">Seleccionar activo...</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nombre} — {a.tipo} ({a.stock} disponibles)
                </option>
              ))}
            </select>
            {errors.activo_id && <p className="text-xs text-rose-400 mt-1">{errors.activo_id}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Clave / Número de licencia</label>
            <input
              type="text"
              value={form.clave_asignada}
              onChange={e => setForm(p => ({ ...p, clave_asignada: e.target.value }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                errors.clave_asignada ? 'border-rose-300' : 'border-slate-200'
              }`}
              placeholder="Ej: XXXXX-XXXXX-XXXXX"
            />
            {errors.clave_asignada && <p className="text-xs text-rose-400 mt-1">{errors.clave_asignada}</p>}
          </div>

          {/* 🆕 Campo fecha de vencimiento */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Fecha de vencimiento <span className="text-slate-300 font-normal">(opcional)</span>
            </label>
            <input
              type="date"
              value={form.fecha_vencimiento}
              onChange={e => setForm(p => ({ ...p, fecha_vencimiento: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>

          {feedback && (
            <p className={`text-xs rounded-lg px-3 py-2 ${
              feedback.startsWith('✓')
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-400'
            }`}>
              {feedback}
            </p>
          )}

          <button
            onClick={handleAssign}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer"
          >
            {saving ? 'Asignando...' : 'Asignar licencia'}
          </button>
        </div>
      )}

      {/* 🆕 Aviso si está dado de baja */}
      {usuarioDadoDeBaja && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4">
          <p className="text-sm text-rose-500">
            Este usuario está dado de baja. No se pueden asignar nuevas licencias.
          </p>
        </div>
      )}

    </div>
  );
}