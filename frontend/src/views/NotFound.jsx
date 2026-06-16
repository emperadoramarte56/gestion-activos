import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center p-6">
      <div>
        <p className="text-8xl font-black text-brand-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-slate-400 text-sm mb-6">La ruta que buscas no existe o no tienes acceso.</p>
        <Link to="/" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}