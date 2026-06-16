import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetAssets, apiDeleteAsset } from '../../services/api';

export default function Inventario() {
  const navigate = useNavigate();
  const [assets,     setAssets]     = useState([]);
  const [tipos,      setTipos]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');

  const fetchAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGetAssets();
      setAssets(data);
      const tiposUnicos = ['Todos', ...new Set(data.map(a => a.tipo).filter(Boolean))];
      setTipos(tiposUnicos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await apiDeleteAsset(id);
      await fetchAssets();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filtered = assets
    .filter(i => filterTipo === 'Todos' || i.tipo === filterTipo)
    .filter(i => i.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Inventario</h1>
          <p className="text-sm text-slate-500 mt-0.5">Licencias y activos registrados</p>
        </div>
        {/* BOTÓN AGREGAR — navega a pantalla separada para que el breadcrumb funcione */}
        <button
          onClick={() => navigate('/admin/inventario/nueva-licencia')}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Agregar licencia
        </button>
      </div>

      {/* Filtros dinámicos desde la DB */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar licencia..."
          className="flex-1 min-w-40 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
        />
        {tipos.map(t => (
          <button
            key={t}
            onClick={() => setFilterTipo(t)}
            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer border ${
              filterTipo === t
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 text-slate-500 hover:border-brand-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-sm">
          Error al cargar inventario: {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">Nombre</th>
              <th className="text-left px-5 py-3 font-medium">Tipo</th>
              <th className="text-left px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                  Cargando inventario...
                </td>
              </tr>
            )}
            {!loading && filtered.map(item => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-700">{item.nombre}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.tipo}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={item.stock <= 2 ? 'text-rose-500 font-semibold' : 'text-slate-500'}>
                    {item.stock}
                    {item.stock <= 2 && (
                      <span className="ml-1.5 text-xs bg-rose-50 text-rose-400 px-1.5 py-0.5 rounded font-normal">
                        crítico
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => navigate(`/admin/inventario/editar-licencia/${item.id}`)}
                      className="text-xs text-brand-500 hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.nombre)}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}