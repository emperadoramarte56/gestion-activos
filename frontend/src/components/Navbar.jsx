import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROL_BADGE = {
  1: { label: 'Admin TI',     color: 'bg-brand-100 text-brand-700' },
  2: { label: 'Líder de Área', color: 'bg-emerald-100 text-emerald-600' },
  3: { label: 'Empleado',     color: 'bg-slate-200 text-slate-600' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const badge = ROL_BADGE[user?.rol_id] ?? { label: user?.rol, color: 'bg-slate-200 text-slate-600' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-500" />
        <span className="font-semibold text-slate-800 tracking-tight text-sm">LicenseDesk</span>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-sm text-slate-600 font-medium">{user?.nombre}</span>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 hover:text-rose-500 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}