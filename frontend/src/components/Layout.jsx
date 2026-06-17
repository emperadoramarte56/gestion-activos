import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Overlay oscuro en móvil */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
          <div style={{ marginBottom: '16px' }}>
            <Breadcrumbs />
          </div>
          <Outlet />
        </main>

      </div>
    </div>
  );
}