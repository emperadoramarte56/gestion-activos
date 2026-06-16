import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
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