const BASE_URL = 'http://localhost:5005/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

const request = async (method, path, body = null) => {
  const options = { method, headers: authHeaders() };
  if (body) options.body = JSON.stringify(body);
  const res  = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error desconocido del servidor');
  return data;
};

// ── AUTH ──────────────────────────────────────────────────────
export const apiLogin = (email, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Credenciales incorrectas');
    return data;
  });

// ── DASHBOARD ─────────────────────────────────────────────────
export const apiGetDashboardSummary = () => request('GET', '/dashboard/summary');
export const apiGetDashboardAlerts  = () => request('GET', '/dashboard/alerts');

// ── ACTIVOS ───────────────────────────────────────────────────
export const apiGetAssets    = ()        => request('GET',    '/assets');
export const apiCreateAsset  = (body)    => request('POST',   '/assets', body);
export const apiUpdateAsset  = (id, body) => request('PUT',    `/assets/${id}`, body);
export const apiDeleteAsset  = (id)      => request('DELETE', `/assets/${id}`);

// ── USUARIOS ──────────────────────────────────────────────────
export const apiGetUsers      = ()     => request('GET',  '/users');
export const apiCreateUser    = (body) => request('POST', '/users', body);
export const apiGetUserAccess = (id)   => request('GET',  `/users/${id}/access`);
export const apiOffboardUser  = (id)   => request('PATCH', `/users/${id}/offboard`);

// ── ASIGNACIONES ──────────────────────────────────────────────
export const apiAssignAsset = (body) => request('POST', '/assignments', body);

// ── SOLICITUDES ──────────────────────────────────────────────
export const apiGetSolicitudes  = () => request('GET', '/solicitudes');
export const apiCreateRequest   = (body) => request('POST', '/solicitudes', body);
export const apiUpdateSolicitud = (id, estado) => request('PATCH', `/solicitudes/${id}`, { estado });