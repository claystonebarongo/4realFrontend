import { useState, useEffect } from 'react';
import { Users, ClipboardList, Receipt, Search } from 'lucide-react';

// Centralized production URL
const API_BASE_URL = 'https://fourrealbackend.onrender.com';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'inspections' | 'transactions'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [usersRes, insRes, transRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/members`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/admin/inspections`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/admin/transactions`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const [userData, insData, transData] = await Promise.all([
        usersRes.json(),
        insRes.json(),
        transRes.json()
      ]);
      
      setUsers(userData || []);
      setInspections(insData.inspections || []);
      setTransactions(transData.transactions || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Admin Control Panel</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
        {[ { id: 'users', label: 'Members', icon: Users }, { id: 'inspections', label: 'Inspections', icon: ClipboardList }, { id: 'transactions', label: 'Audit Log', icon: Receipt } ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 0', border: 'none', background: 'none', borderBottom: activeTab === tab.id ? '2px solid #2563EB' : 'none', color: activeTab === tab.id ? '#2563EB' : '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9CA3AF' }} />
          <input type="text" placeholder="Search members by name or email..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }} />
        </div>
      )}

      <div className="corporate-card" style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {activeTab === 'transactions' ? (
                <><th>User</th><th>Code</th><th>Amount</th><th>Date</th></>
              ) : activeTab === 'users' ? (
                <><th>Name</th><th>Vehicle</th><th>Status</th></>
              ) : (
                <><th>Member</th><th>Service</th><th>Date</th><th>Status</th></>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'users' && filteredUsers.map((u: any) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{u.name}<br/><span style={{ fontSize: '12px', color: '#666' }}>{u.email}</span></td>
                <td style={{ padding: '16px' }}>{u.vehicleDetails?.regNumber || 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '10px', fontSize: '12px', background: u.membershipStatus === 'paid' ? '#DEF7EC' : '#FDE8E8' }}>{u.membershipStatus || 'pending'}</span>
                </td>
              </tr>
            ))}
            {activeTab === 'inspections' && inspections.map((i: any) => (
              <tr key={i._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{i.userId?.name || 'Unknown'}</td>
                <td style={{ padding: '16px' }}>{i.type || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{i.appointmentDate ? new Date(i.appointmentDate).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: '16px' }}>{i.status}</td>
              </tr>
            ))}
            {activeTab === 'transactions' && transactions.map((t: any) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{t.userName || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{t.mpesaCode || 'N/A'}</td>
                <td style={{ padding: '16px' }}>KES {t.amount}</td>
                <td style={{ padding: '16px' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}