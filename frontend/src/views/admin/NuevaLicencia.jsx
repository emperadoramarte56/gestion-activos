import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreateAsset } from '../../services/api';

// El backend recibe: { nombre, tipo, stock }
// La columna de la DB es "stock", no "total"/"disponibles" como en el mock

const EMPTY = { nombre: '', tipo: '', stock: '' };

export default function NuevaLicencia() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.tipo.trim())   e.tipo   = 'El tipo es requerido';
    if (!form.stock)         e.stock  = 'Ingresa la cantidad de licencias';
    if (+form.stock < 0)     e.stock  = 'El stock no puede ser negativo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      // POST /api/assets  →  { nombre, tipo, stock }
      await apiCreateAsset({
        nombre: form.nombre,
        tipo:   form.tipo,
        stock:  +form.stock,
      });
      navigate('/admin/inventario');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
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
        <h1 className="text-xl font-bold text-slate-800">Nueva licencia</h1>
        <p className="text-sm text-slate-500 mt-0.5">Completa los datos del activo a registrar</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {field('Nombre de la licencia', 'nombre', 'text', 'Ej: Windows 11 Pro')}
        
        {field('Tipo', 'tipo', 'text', 'Ej: Software, Sistema Operativo, Cloud')}

        {field('Cantidad de licencias (stock)', 'stock', 'number', '0')}

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
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-17 py-2 rounded-lg transition-colors cursor-pointer"  
        >
          {loading ? 'Guardando...' : 'Guardar licencia'}
        </button>
      </div>
    </div>
  );
}