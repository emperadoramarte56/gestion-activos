import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditarUsuario() {
  const { id }              = useParams();
  const { mockUsers, updateUser } = useAuth();
  const navigate            = useNavigate();
  const [form, setForm]     = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // TODO Backend: GET /api/users/:id
    const found = mockUsers.find(u => u.id === +id);
    if (found) setForm({ ...found });
    else navigate('/admin/usuarios');
  }, [id, mockUsers]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email.trim())  e.email  = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.area.trim())   e.area   = 'El área es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // TODO Backend: PUT /api/users/:id  body: form
    updateUser({ ...form, rol_id: +form.rol_id });
    navigate('/admin/usuarios');
  };

  if (!form) return (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Cargando...</div>
  );

  const field = (label, key, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
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
        <h1 className="text-xl font-bold text-slate-800">Editar usuario</h1>
        <p className="text-sm text-slate-500 mt-0.5">Modifica los datos del empleado</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {field('Nombre completo',     'nombre')}
        {field('Correo electrónico',  'email', 'email')}
        {field('Área / Departamento', 'area')}

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Rol</label>
          <select
            value={form.rol_id}
            onChange={e => setForm(p => ({ ...p, rol_id: +e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white"
          >
            <option value={1}>Admin TI</option>
            <option value={2}>Líder de Área</option>
            <option value={3}>Empleado</option>
          </select>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-xs text-amber-600">
            Cambiar el rol tendrá efecto en el siguiente inicio de sesión del usuario.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer transition-colors"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}