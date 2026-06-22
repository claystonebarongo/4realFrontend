import { useState, useEffect, type CSSProperties } from 'react';
import logoImage from '../assets/IMG-20260620-WA0009.jpg'; // Restored your original logo asset

interface NavbarProps {
  currentPath: string;
  onNavigate: (to: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isAuthenticated = !!localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    onNavigate('/login');
  };

  const handleNavigation = (targetPath: string) => {
    setIsOpen(false);
    onNavigate(targetPath);
  };

  const handleScrollToSection = (sectionId: string) => {
    setIsOpen(false);
    const targetId = sectionId === 'about-us' ? 'about' : sectionId;

    if (currentPath !== '/' && currentPath !== '/home') {
      onNavigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId) || document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const element = document.getElementById(targetId) || document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Restored your original light-themed color profile links
  const getTabStyle = (tabPath: string, isAnchor = false): CSSProperties => ({
    color: (currentPath === tabPath && !isAnchor) ? '#2563EB' : '#4B5563',
    fontSize: isMobile ? '16px' : '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    padding: isMobile ? '16px 0' : '0',
    width: isMobile ? '100%' : 'auto',
    textAlign: isMobile ? 'left' : 'center',
    display: isMobile ? 'block' : 'inline-block',
    borderBottom: isMobile ? '1px solid #E5E7EB' : 'none'
  });

  return (
    <nav style={{ 
      background: '#FFFFFF', // Restored your crisp white brand background
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Bar Wrapper */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: isMobile ? '0 20px' : '0 40px', 
        height: '75px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Restored Logo Image & Brand Accent Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: '#F1F5F9', padding: '6px 14px', borderRadius: '4px' }} onClick={() => handleNavigation('/')}>
          <img src={logoImage} alt="4REAL Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 900, fontSize: '18px', color: '#111827', letterSpacing: '-0.5px' }}>4REAL</span>
        </div>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <span style={getTabStyle('/')} onClick={() => handleNavigation('/')}>Home</span>
            <span style={getTabStyle('/', true)} onClick={() => handleScrollToSection('about-us')}>About Us</span>
            <span style={getTabStyle('/', true)} onClick={() => handleScrollToSection('services')}>Services</span>
            
            {!isAuthenticated ? (
              <>
                <span style={getTabStyle('/register')} onClick={() => handleNavigation('/register')}>Register</span>
                <span style={getTabStyle('/login')} onClick={() => handleNavigation('/login')}>Login</span>
              </>
            ) : (
              <>
                <span style={getTabStyle('/dashboard')} onClick={() => handleNavigation('/dashboard')}>Dashboard</span>
                {isAdmin && <span style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }} onClick={() => handleNavigation('/admin')}>Admin</span>}
                <button 
                  onClick={handleLogout} 
                  style={{
                    background: 'transparent',
                    border: '1px solid #EF4444',
                    color: '#EF4444',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  Logout
                </button>
              </>
            )}
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#A0AEC0', cursor: 'not-allowed' }}>Admin</span>
          </div>
        )}

        {/* Dark Styled Hamburger Icon for White Background */}
        {isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#111827', // Changed icon line color to dark grey to pop against the white nav
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              outline: 'none'
            }}
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile Drawer Dropdown Menu Panel */}
      {isMobile && isOpen && (
        <div style={{
          background: '#FFFFFF', // Clean white background on the responsive menu container
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          padding: '0px 20px 20px 20px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          position: 'absolute',
          top: '75px',
          left: 0,
          right: 0,
          zIndex: 999,
          boxSizing: 'border-box'
        }}>
          <span style={getTabStyle('/')} onClick={() => handleNavigation('/')}>Home</span>
          <span style={getTabStyle('/', true)} onClick={() => handleScrollToSection('about-us')}>About Us</span>
          <span style={getTabStyle('/', true)} onClick={() => handleScrollToSection('services')}>Services</span>
          
          {!isAuthenticated ? (
            <>
              <span style={getTabStyle('/register')} onClick={() => handleNavigation('/register')}>Register</span>
              <span style={getTabStyle('/login')} onClick={() => handleNavigation('/login')}>Login</span>
            </>
          ) : (
            <>
              <span style={getTabStyle('/dashboard')} onClick={() => handleNavigation('/dashboard')}>Dashboard</span>
              {isAdmin && <span style={getTabStyle('/admin')} onClick={() => handleNavigation('/admin')}>Admin</span>}
              <button 
                onClick={handleLogout} 
                style={{
                  background: '#E53E3E',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '15px',
                  marginTop: '16px',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}