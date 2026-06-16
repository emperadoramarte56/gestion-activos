import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGetAssets, apiUpdateAsset } from '../../services/api';

export default function EditarLicencia() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [form,     setForm]     = useState(null);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const assets = await apiGetAssets();
        const found  = assets.find(a => a.id === +id);
        if (found) setForm({ ...found });
        else navigate('/admin/inventario');
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (form.stock === '' || form.stock === undefined) e.stock = 'Ingresa el stock';
    if (+form.stock < 0) e.stock = 'El stock no puede ser negativo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      await apiUpdateAsset(form.id, {
        nombre: form.nombre,
        tipo:   form.tipo,
        stock:  +form.stock,
      });
      navigate('/admin/inventario');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
      Cargando...
    </div>
  );

  if (!form) return null;

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
        placeholder={placeholder}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${
          errors[key]
            ? 'border-rose-300 focus:border-rose-400 bg-rose-50'
            : 'border-slate-200 focus:border-brand-400'
        }`}
      />
      {errors[key] && <p className="text-xs text-rose-400 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Editar licencia</h1>
        <p className="text-sm text-slate-500 mt-0.5">Modifica los datos del activo</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {field('Nombre de la licencia', 'nombre', 'text')}

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
          <input
            type="text"
            value={form.tipo ?? ''}
            onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>

        {field('Stock de licencias', 'stock', 'number', '0')}

        {apiError && (
          <p className="text-xs text-rose-400 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
            {apiError}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/admin/inventario')}
          className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-17 py-2 rounded-lg transition-colors cursor-pointer"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}