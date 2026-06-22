import React, { useState, useEffect } from 'react';
import { Mail, Lock, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onNavigate: (to: string) => void;
}

// Set this to your production backend URL
const API_BASE_URL = 'https://fourrealbackend.onrender.com';

export default function Login({ onNavigate }: LoginProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 500;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Updated to use the API_BASE_URL constant
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setSuccess('Authentication successful! Redirecting...');
      
      setTimeout(() => {
        if (data.user.role === 'admin') {
          onNavigate('/admin');
        } else {
          onNavigate('/dashboard');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: isMobile ? '20px 12px' : '20px', background: '#F4F6F9' }}>
      <div className="corporate-card" style={{ 
        width: '100%', maxWidth: '450px', padding: isMobile ? '32px 20px' : '40px',
        background: '#FFFFFF', borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB', boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: isMobile ? '28px' : '32px', fontWeight: 700, margin: '0 0 8px 0', color: '#1E2530' }}>
            Welcome to <span style={{ color: '#2563EB' }}>4REAL</span>
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: isMobile ? '13px' : '14px' }}>Log in to access your dashboard</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FCE8E6', border: '1px solid #EA4335', padding: '12px 16px', borderRadius: '6px', color: '#C5221F', marginBottom: '24px' }}>
            <ShieldAlert size={20} />
            <span style={{ fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: '#EFF6FF', border: '1px solid #3B82F6', padding: '12px 16px', borderRadius: '6px', color: '#1E40AF', marginBottom: '24px', fontSize: '14px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input type="email" name="email" required className="corporate-input" value={formData.email} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input type="password" name="password" required className="corporate-input" value={formData.password} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <button type="submit" className="corporate-btn-primary" style={{ marginTop: '10px', width: '100%', backgroundColor: '#2563EB', color: '#FFFFFF', padding: '14px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 600 }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Don't have an account?{' '}
          <span onClick={() => onNavigate('/register')} style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}