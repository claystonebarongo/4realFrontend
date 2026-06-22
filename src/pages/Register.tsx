import { useState, useEffect } from 'react';
import { User, Phone, Mail, Lock, Car, Calendar, ShieldAlert } from 'lucide-react';

interface RegisterProps {
  onNavigate: (to: string) => void;
}

// Updated to production URL
const API_BASE_URL = 'https://fourrealbackend.onrender.com';

export default function Register({ onNavigate }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    regNumber: '',
    makeModel: '',
    yearOfManufacture: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 600;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          regNumber: formData.regNumber,
          makeModel: formData.makeModel,
          yearOfManufacture: Number(formData.yearOfManufacture)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(data.message || 'Registration successful! Redirecting to login...');
      
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: '',
        regNumber: '',
        makeModel: '',
        yearOfManufacture: ''
      });

      setTimeout(() => {
        onNavigate('/login');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: isMobile ? '20px 12px' : '40px 20px', background: '#F4F6F9' }}>
      <div className="corporate-card" style={{ 
        width: '100%', 
        maxWidth: '650px', 
        padding: isMobile ? '24px 16px' : '40px',
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px', color: '#1E2530' }}>
            Join <span style={{ color: '#2563EB' }}>4REAL</span>
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: isMobile ? '13px' : '14px' }}>Create your profile and link your membership vehicle</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FCE8E6', border: '1px solid #EA4335', padding: '12px 16px', borderRadius: '6px', color: '#C5221F', marginBottom: '24px' }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: '#EFF6FF', border: '1px solid #3B82F6', padding: '12px 16px', borderRadius: '6px', color: '#1E40AF', marginBottom: '24px', fontSize: '14px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2563EB', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="text" name="name" required className="corporate-input" value={formData.name} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="text" name="phone" required className="corporate-input" value={formData.phone} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginTop: '16px' }}>
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
            </div>
          </div>

          <hr style={{ border: '0', height: '1px', background: '#E5E7EB', margin: '4px 0' }} />

          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2563EB', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vehicle Profiling</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Make & Model</label>
                <div style={{ position: 'relative' }}>
                  <Car size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="text" name="makeModel" required placeholder="e.g. Toyota Vanguard" className="corporate-input" value={formData.makeModel} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Year</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="number" name="yearOfManufacture" required placeholder="2018" className="corporate-input" value={formData.yearOfManufacture} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Registration Number</label>
              <div style={{ position: 'relative' }}>
                <Car size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="text" name="regNumber" required placeholder="e.g. KAA 123A" className="corporate-input" value={formData.regNumber} onChange={handleChange} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="corporate-btn-primary" 
            style={{ 
              marginTop: '12px', 
              width: '100%',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'background-color 0.2s ease'
            }}
          >
            Register Vehicle & Profile
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Already have an account?{' '}
          <span 
            onClick={() => onNavigate('/login')} 
            style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}