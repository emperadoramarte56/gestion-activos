import { useState, useEffect } from 'react';
import { apiGetDashboardSummary, apiGetDashboardAlerts } from '../../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // GET /api/dashboard/summary  y  GET /api/dashboard/alerts en paralelo
        const [summaryData, alertsData] = await Promise.all([
          apiGetDashboardSummary(),
          apiGetDashboardAlerts(),
        ]);
        setMetrics(summaryData.metrics);
        setAlerts(alertsData.alerts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
      Cargando dashboard...
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-4 text-sm">
      Error al cargar el dashboard: {error}
    </div>
  );

  // Mapeo de las métricas del backend a las tarjetas visuales
  const STATS = [
    {
      label: 'Tipos de activos',
      value: metrics?.total_activos_tipos ?? 0,
      sub:   'Licencias registradas',
      color: 'text-brand-500',
      bg:    'bg-brand-50',
    },
    {
      label: 'Stock global disponible',
      value: metrics?.stock_global_disponible ?? 0,
      sub:   'Unidades en inventario',
      color: 'text-emerald-500',
      bg:    'bg-emerald-50',
    },
    {
      label: 'Empleados activos',
      value: metrics?.empleados_registrados ?? 0,
      sub:   'Con acceso al sistema',
      color: 'text-slate-500',
      bg:    'bg-slate-100',
    },
    {
      label: 'Licencias asignadas',
      value: metrics?.licencias_asignadas_actuales ?? 0,
      sub:   'Asignaciones totales',
      color: 'text-amber-500',
      bg:    'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Resumen general de licencias y activos</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${s.bg} mb-3`}>
              <span className={`text-lg ${s.color}`}>●</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Alertas de stock crítico */}
      {alerts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-amber-500 text-base">⚠</span>
            <h2 className="text-sm font-semibold text-slate-700">
              Alertas de stock crítico
            </h2>
            <span className="ml-auto text-xs bg-amber-100 text-amber-500 font-medium px-2 py-0.5 rounded-full">
              {alerts.length}
            </span>
          </div>
          <ul className="divide-y divide-slate-50">
            {alerts.map(alert => (
              <li key={alert.id} className="px-5 py-3 flex items-start gap-3">
                <span className="text-xs font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded mt-0.5 shrink-0">
                  {alert.tipo}
                </span>
                <p className="text-sm text-slate-600">{alert.mensaje}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4 flex items-center gap-2 text-emerald-600 text-sm">
          <span>✓</span>
          <span>Todo el inventario tiene stock suficiente. Sin alertas activas.</span>
        </div>
      )}
    </div>
  );
}