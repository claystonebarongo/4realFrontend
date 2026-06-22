import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard'; // Added Import

export default function App() {
  const [path, setPath] = useState<string>(window.location.pathname);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    switch (path) {
      case '/':
      case '/home': return <Home onNavigate={navigate} />;
      case '/register': return <Register onNavigate={navigate} />;
      case '/login': return <Login onNavigate={navigate} />;
      case '/payment': return <Payment />;
      case '/dashboard': return <Dashboard />;
      case '/admin': return <AdminDashboard />; // Added Route
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '16px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>404</h1>
            <p style={{ color: '#6B7280', margin: 0 }}>The requested interface routing coordinate could not be discovered.</p>
            <button className="corporate-btn-primary" onClick={() => navigate('/')}>Return Home</button>
          </div>
        );
    }
  };

  // Updated layout check to include /admin
  const isDashboardLayout = path === '/dashboard' || path === '/payment' || path === '/admin';
  const isResponsiveStack = windowWidth <= 768;
  const isExtraSmall = windowWidth <= 480;

  if (isDashboardLayout) {
    return (
      <div style={{ display: 'flex', flexDirection: isResponsiveStack ? 'column' : 'row', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
        <div className="corporate-sidebar" style={{ 
          width: isResponsiveStack ? '100%' : '260px', 
          minHeight: isResponsiveStack ? 'auto' : '100vh', 
          padding: isResponsiveStack ? '14px 16px' : '30px 20px', 
          boxSizing: 'border-box', 
          display: 'flex', 
          flexDirection: isResponsiveStack ? 'row' : 'column', 
          justifyContent: isResponsiveStack ? 'space-between' : 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: isResponsiveStack ? '1px solid #E5E7EB' : 'none'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontWeight: 800, fontSize: isExtraSmall ? '14px' : '16px', letterSpacing: '0.5px' }}>4REAL AUTOCARE</span>
          </div>
          
          {!isResponsiveStack && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, width: '100%' }}>
              <div style={{ padding: '12px 16px', borderRadius: '6px', cursor: 'pointer', backgroundColor: path === '/dashboard' ? '#2D3748' : 'transparent', fontWeight: 600 }} onClick={() => navigate('/dashboard')}>Dashboard</div>
              <div style={{ padding: '12px 16px', borderRadius: '6px', cursor: 'pointer', backgroundColor: path === '/payment' ? '#2D3748' : 'transparent', fontWeight: 600 }} onClick={() => navigate('/payment')}>Payments</div>
              <div style={{ padding: '12px 16px', borderRadius: '6px', cursor: 'pointer', backgroundColor: path === '/admin' ? '#2D3748' : 'transparent', fontWeight: 600 }} onClick={() => navigate('/admin')}>Admin Panel</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {isResponsiveStack && (
              <button className="corporate-btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => navigate('/admin')}>Admin</button>
            )}
            <button className="corporate-btn-primary" style={{ background: '#E53E3E', padding: '6px 10px', fontSize: '12px' }} onClick={logout}>Logout</button>
          </div>
        </div>
        
        <div style={{ flexGrow: 1, backgroundColor: '#F4F6F9', minHeight: '100vh', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Navbar currentPath={path} onNavigate={navigate} />
      {renderContent()}
    </div>
  );
}