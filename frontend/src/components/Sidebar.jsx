import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  1: [
    { to: '/admin/dashboard',   icon: '⊞', label: 'Dashboard' },
    { to: '/admin/inventario',  icon: '⊟', label: 'Inventario' },
    { to: '/admin/usuarios',    icon: '⊙', label: 'Usuarios' },
    { to: '/admin/solicitudes', icon: '≡', label: 'Solicitudes' },
  ],
  2: [
    { to: '/manager/mi-equipo',   icon: '◈', label: 'Mi Equipo' },
    { to: '/manager/solicitudes', icon: '≡', label: 'Solicitudes' },
  ],
  3: [
    { to: '/empleado/mis-activos', icon: '◉', label: 'Mis Activos' },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = NAV[user?.rol_id] ?? [];

  return (
    <aside className={`
      w-56 bg-slate-900 flex flex-col shrink-0
      fixed top-0 left-0 h-full z-30 transition-transform duration-300
      lg:static lg:translate-x-0 lg:z-auto
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>

      {/* Botón cerrar — solo móvil */}
      <div className="flex justify-end px-3 pt-3 lg:hidden">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xl leading-none"
        >
          ✕
        </button>
      </div>

      <div className="px-5 py-6 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
          Módulos
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">v1.0.0</p>
      </div>

    </aside>
  );
}