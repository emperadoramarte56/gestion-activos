import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  admin:             'Admin',
  manager:           'Manager',
  empleado:          'Empleado',
  dashboard:         'Dashboard',
  inventario:        'Inventario',
  'nueva-licencia':  'Nueva licencia',
  'editar-licencia': 'Editar licencia',
  usuarios:          'Usuarios',
  'nuevo-usuario':   'Nuevo usuario',
  'editar-usuario':  'Editar usuario',
  accesos:           'Accesos',
  'mi-equipo':       'Mi Equipo',
  'mis-activos':     'Mis Activos',
  'solicitudes':     'Solicitudes'
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) return null;

  // Ocultar segmentos numéricos (IDs) mostrando solo la etiqueta anterior
  const visible = parts.filter((p, i) => {
    const isNumber = !isNaN(p);
    return !isNumber;
  });

  return (
    <nav className="flex items-center gap-1 text-xs text-slate-400" aria-label="breadcrumb">
      {visible.map((part, i) => {
        // Reconstruir la ruta real incluyendo IDs
        const to    = '/' + parts.slice(0, parts.indexOf(part, i) + 1).join('/');
        const isLast = i === visible.length - 1;
        const label  = LABELS[part] ?? part;

        return (
          <span key={`${part}-${i}`} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300 select-none">/</span>}
            {isLast ? (
              <span className="text-slate-700 font-semibold">{label}</span>
            ) : (
              <Link to={to} className="hover:text-brand-500 transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}