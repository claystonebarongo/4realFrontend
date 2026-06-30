import { useEffect, useState } from 'react';
import { Car, ShieldCheck, ShieldAlert, ClipboardList, Activity, Gauge, CalendarClock, MessageSquareCode } from 'lucide-react';

interface VehicleDetails {
  regNumber: string;
  makeModel: string;
  yearOfManufacture: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipStatus: 'unpaid' | 'paid';
  vehicleDetails: VehicleDetails;
  inspectionsRemaining: number;
  diagnosticTestsRemaining: number;
  periodicChecksRemaining: number;
}

interface InspectionRecord {
  _id: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  appointmentDate?: string;
  inspectionResponse?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [latestAppointment, setLatestAppointment] = useState<InspectionRecord | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Helper to fetch full data (Profile + Inspection History)
  const refreshDashboard = async () => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!savedUser || !token) return;

    const parsedUser = JSON.parse(savedUser);

    try {
    
      const profileRes = await fetch(`https://fourrealbackend.onrender.com/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      if (profileData) {
        setUser(profileData);
        localStorage.setItem('user', JSON.stringify(profileData));
      }

      
      const historyRes = await fetch(`https://fourrealbackend.onrender.com/api/inspections/history/${parsedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyData = await historyRes.json();
      
      if (historyData.success && historyData.history && historyData.history.length > 0) {
        const scheduled = historyData.history.find((item: InspectionRecord) => item.status === 'scheduled');
        setLatestAppointment(scheduled || historyData.history[0]);
      }
    } catch (err) {
      
      console.error("Failed to sync dashboard:", err);
    }
  };

  useEffect(() => {


    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    
    refreshDashboard();

    
    const interval = setInterval(refreshDashboard, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  if (!user) return null;

  const isActive = user.membershipStatus === 'paid';
  const isTablet = windowWidth <= 968;
  const isMobile = windowWidth <= 640;

  const formatAppointmentDate = (dateString?: string) => {
    if (!dateString) return 'No Inspection Scheduled';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: isMobile ? '20px 12px' : '40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, margin: '0 0 4px 0', color: '#1E2530' }}>Welcome, {user.name}</h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '14px' }}>4REAL Corporate Membership Dashboard</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '20px', background: isActive ? '#E6F4EA' : '#FCE8E6', border: '1px solid', borderColor: isActive ? '#34A853' : '#EA4335' }}>
          {isActive ? (
            <>
              <ShieldCheck size={18} style={{ color: '#137333', flexShrink: 0 }} />
              <span style={{ color: '#137333', fontSize: '14px', fontWeight: 600 }}>Active Member</span>
            </>
          ) : (
            <>
              <ShieldAlert size={18} style={{ color: '#C5221F', flexShrink: 0 }} />
              <span style={{ color: '#C5221F', fontSize: '14px', fontWeight: 600 }}>Unpaid Account</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 2fr', gap: '32px', marginBottom: '40px' }}>
        <div className="corporate-card" style={{ 
          padding: '32px',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          boxSizing: 'border-box',
          height: 'fit-content'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 24px 0', color: '#2563EB' }}>Vehicle Profile</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#F4F6F9', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', flexShrink: 0 }}>
                <Car size={24} style={{ color: '#1E2530' }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Make & Model</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1E2530' }}>{user.vehicleDetails.makeModel}</div>
              </div>
            </div>

            <hr style={{ border: '0', height: '1px', background: '#E5E7EB' }} />

            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Registration Mark</div>
              <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '1px', color: '#1E2530' }}>{user.vehicleDetails.regNumber}</div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Year of Manufacture</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#1E2530' }}>{user.vehicleDetails.yearOfManufacture}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {!isActive && (
            <div className="corporate-card" style={{ 
              padding: '24px', 
              background: '#FCE8E6', 
              borderColor: '#EA4335',
              borderRadius: '12px',
              border: '1px solid #EA4335',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#C5221F', fontWeight: 600 }}>Membership Activation Required</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>To activate your 1-year coverage and schedule services, submit your KES 15,000 package premium via M-PESA and verify your transaction.</p>
              <button 
                className="corporate-btn-primary" 
                style={{ 
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }} 
                onClick={() => window.location.href = '/payment'}
              >
                Submit Payment Code
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', width: '100%' }}>
            <div className="corporate-card" style={{ padding: '28px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }}>
              <ClipboardList size={28} style={{ color: '#2563EB', marginBottom: '16px' }} />
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '4px', color: '#1E2530' }}>{user.inspectionsRemaining}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Standard Inspections</div>
            </div>

            <div className="corporate-card" style={{ padding: '28px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }}>
              <Activity size={28} style={{ color: '#2563EB', marginBottom: '16px' }} />
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '4px', color: '#1E2530' }}>{user.diagnosticTestsRemaining}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Diagnostic Tests</div>
            </div>

            <div className="corporate-card" style={{ padding: '28px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }}>
              <Gauge size={28} style={{ color: '#2563EB', marginBottom: '16px' }} />
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '4px', color: '#1E2530' }}>{user.periodicChecksRemaining}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Periodic Checks</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', width: '100%' }}>
            <div className="corporate-card" style={{ padding: '24px', display: 'flex', alignItems: 'start', gap: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }}>
              <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '8px', flexShrink: 0 }}>
                <CalendarClock size={24} style={{ color: '#2563EB' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Next Inspection</h4>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E2530' }}>
                  {formatAppointmentDate(latestAppointment?.appointmentDate)}
                </div>
              </div>
            </div>

            <div className="corporate-card" style={{ padding: '24px', display: 'flex', alignItems: 'start', gap: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }}>
              <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '8px', flexShrink: 0 }}>
                <MessageSquareCode size={24} style={{ color: '#2563EB' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Inspection Response</h4>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E2530', lineHeight: '1.4' }}>
                  {latestAppointment?.inspectionResponse || 'Awaiting Inspection Schedule'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}