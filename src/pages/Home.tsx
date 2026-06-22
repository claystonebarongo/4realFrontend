import { useState, useEffect } from 'react';
import { ClipboardList, ShieldCheck, Clock } from 'lucide-react';
import bgImage from '../assets/IMG-20260620-WA0011.jpg'; 

interface HomeProps {
  onNavigate?: (to: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  // Simple hook to monitor window width for responsive adjustments
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Safe wrapper to handle navigation across your custom App.tsx state engine
  const handleRedirect = (targetPath: string) => {
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <div style={{ background: '#F4F6F9', color: '#1E2530', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Main Content Wrapper */}
      <div style={{ flexGrow: 1 }}>
        {/* Full-width Hero Section */}
        <div style={{ 
          position: 'relative',
          width: '100%',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: isMobile ? '80px 0' : '140px 0', 
          textAlign: 'center', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px'
        }}>
          <div style={{ maxWidth: '900px', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <h1 style={{ 
              fontSize: isMobile ? '34px' : '52px', 
              fontWeight: 800, 
              margin: 0, 
              letterSpacing: '-1px', 
              color: '#FFFFFF',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              lineHeight: 1.2
            }}>
              Welcome to <span style={{ color: '#3B82F6' }}>4REAL AUTOCARE</span>
            </h1>
            
            <p style={{ 
              fontSize: isMobile ? '15px' : '17px', 
              color: '#1E2530', 
              lineHeight: '1.65', 
              margin: 0, 
              background: 'rgba(255, 255, 255, 0.96)', 
              padding: isMobile ? '20px' : '32px',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontWeight: 500
            }}>
              Your trusted partner in vehicle care, safety, and compliance. Our membership program is 
              designed to make vehicle inspections and maintenance management simple and convenient. 
              Members can register, select packages, make secure payments, receive inspection reminders, 
              and stay informed about inspection status through one centralized platform. At 4REAL 
              AUTOCARE, we are committed to helping you keep your vehicle roadworthy, safe, and 
              professionally maintained while providing exceptional service every step of the way.
            </p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginTop: '8px', width: isMobile ? '100%' : 'auto' }}>
              <button 
                className="corporate-btn-primary" 
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '14px 32px', fontSize: '16px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)', width: isMobile ? '100%' : 'auto' }}
                onClick={() => handleRedirect('/register')}
              >
                Get Started Now
              </button>
              <button 
                style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#4B5563', padding: '14px 32px', fontSize: '16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: isMobile ? '100%' : 'auto' }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div id="about" style={{ background: '#FFFFFF', padding: isMobile ? '50px 20px' : '90px 40px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '56px' }}>
              <h2 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 700, margin: '0 0 12px 0', color: '#2563EB', letterSpacing: '-0.5px' }}>About Us</h2>
              <p style={{ color: '#6B7280', margin: 0, fontSize: '16px' }}>Automating customer care and automotive standard compliance.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '30px' : '50px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 600, marginBottom: '18px', color: '#1E2530', letterSpacing: '-0.5px', lineHeight: 1.3 }}>Streamlining Digital Garage Infrastructure</h3>
                <p style={{ color: '#4B5563', lineHeight: '1.75', fontSize: '15px', marginBottom: '16px' }}>
                  Most traditional auto-care centers rely heavily on manual schedule tracking and disparate payment receipts. At 4Real AutoCare, we close this gap. Our digital platform integrates seamless scheduling infrastructure with verified payment processing frameworks to ensure compliance is completely effortless.
                </p>
                <p style={{ color: '#4B5563', lineHeight: '1.75', fontSize: '15px', margin: 0 }}>
                  Through centralized reporting structures, fleet analytics, and structural transparency, we provide corporate-grade oversight to individual vehicle owners and administrators alike.
                </p>
              </div>
              <div style={{ flex: 1, background: '#F8FAFC', padding: isMobile ? '24px' : '36px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#1E40AF', fontSize: '19px', fontWeight: 700 }}>Our Core Objectives</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '20px', margin: 0, color: '#4B5563', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>Register and profile enterprise/private vehicles seamlessly.</li>
                  <li>Track and retain exhaustive analytical history profiles for every automated mechanical check.</li>
                  <li>Deploy predictable 4-week compliance interval notification arrays automatically.</li>
                  <li>Process, record, and authorize coverage via reliable M-Pesa API integration modules.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" style={{ padding: isMobile ? '50px 20px' : '90px 40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
            <h2 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 700, margin: '0 0 12px 0', color: '#2563EB', letterSpacing: '-0.5px' }}>Our Automated Services</h2>
            <p style={{ color: '#6B7280', margin: 0, fontSize: '16px' }}>Precision tracking engineered for premium vehicle lifespans.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <ClipboardList size={40} style={{ color: '#2563EB', marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 14px 0', color: '#1E2530' }}>Standard Inspections</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>Comprehensive diagnostic safety evaluations covering roadworthiness, alignment profiles, structural metrics, and safety system validation arrays.</p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <ShieldCheck size={40} style={{ color: '#2563EB', marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 14px 0', color: '#1E2530' }}>Diagnostic Testing</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>On-board powertrain and electrical diagnostic evaluations reading structural computer faults to target anomalies before mechanical degradation manifests.</p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Clock size={40} style={{ color: '#F59E0B', marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 14px 0', color: '#1E2530' }}>Automated Reminders</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>Intelligent alerting modules built to communicate with subscribers exactly every 4 weeks via transactional SMS channels to secure timely execution.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Footer Section */}
      <footer style={{ 
        background: '#111827', 
        color: '#9CA3AF', 
        padding: isMobile ? '40px 20px' : '60px 40px', 
        borderTop: '1px solid #1F2937',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between', 
          gap: '30px',
          alignItems: isMobile ? 'flex-start' : 'center',
          fontSize: '14px'
        }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#FFFFFF', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>4REAL AUTOCARE</span>
            <p style={{ margin: 0, color: '#6B7280', maxWidth: '350px', lineHeight: '1.5' }}>Premium automated mechanical inspection pipelines and safety alert management systems.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About Us</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>Services</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => handleRedirect('/register')}>Register</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => handleRedirect('/login')}>Login</span>
          </div>
        </div>
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '24px auto 0 auto', 
          paddingTop: '20px', 
          borderTop: '1px solid #1F2937', 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#4B5563' 
        }}>
          &copy; {new Date().getFullYear()} 4REAL AUTOCARE. All rights reserved.
        </div>
      </footer>

    </div>
  );
}