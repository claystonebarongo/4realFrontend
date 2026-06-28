import { useState, useEffect } from 'react';
import { Users, ClipboardList, Receipt, } from 'lucide-react';

// Interfaces for Type Safety
interface User {
  _id: string;
  name: string;
  email: string;
  membershipStatus: string;
}

interface Inspection {
  _id: string;
  userId: { name: string };
  type: string;
  status: string;
  appointmentDate?: string;
}

interface Transaction {
  _id: string;
  userId: { name: string };
  mpesaCode: string;
  amount: number;
}

const API_BASE_URL = 'https://fourrealbackend.onrender.com';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'inspections' | 'transactions'>('users');
  
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [usersRes, insRes, transRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/members`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/inspections/pending`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/payments/pending`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const userData: User[] = await usersRes.json();
      const insData: { pending: Inspection[] } = await insRes.json();
      const transData: { pending: Transaction[] } = await transRes.json();
      
      setUsers(userData || []);
      setInspections(insData.pending || []);
      setTransactions(transData.pending || []);
    } catch (err: unknown) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const performAction = async (url: string, method: string, body?: any) => {
    try {
      await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      fetchData(); // Refresh list automatically
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const handleSchedule = async (id: string) => {
    const date = prompt("Enter appointment date (YYYY-MM-DD):");
    if (!date) return;
    performAction(`/api/inspections/${id}/schedule`, 'PATCH', { appointmentDate: date });
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Admin Control Panel</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
        {[ { id: 'users', label: 'Members', icon: Users }, { id: 'inspections', label: 'Pending Inspections', icon: ClipboardList }, { id: 'transactions', label: 'Pending Payments', icon: Receipt } ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 0', border: 'none', background: 'none', borderBottom: activeTab === tab.id ? '2px solid #2563EB' : 'none', color: activeTab === tab.id ? '#2563EB' : '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '16px' }}>Detail</th>
              <th style={{ padding: '16px' }}>Status/Type</th>
              <th style={{ padding: '16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'users' && users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{u.name}<br/><span style={{ fontSize: '12px', color: '#666' }}>{u.email}</span></td>
                <td style={{ padding: '16px' }}>{u.membershipStatus}</td>
                <td style={{ padding: '16px' }}>-</td>
              </tr>
            ))}
            
            {activeTab === 'inspections' && inspections.map((i) => (
              <tr key={i._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{i.userId?.name}</td>
                <td style={{ padding: '16px' }}>{i.type}</td>
                <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleSchedule(i._id)} style={{ background: '#2563EB', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Schedule</button>
                  <button onClick={() => performAction(`/api/inspections/${i._id}/cancel`, 'PATCH')} style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </td>
              </tr>
            ))}
            
            {activeTab === 'transactions' && transactions.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{t.userId?.name}<br/><span style={{ fontSize: '12px' }}>{t.mpesaCode}</span></td>
                <td style={{ padding: '16px' }}>KES {t.amount}</td>
                <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => performAction(`/api/payments/${t._id}/verify`, 'PATCH')} style={{ background: '#10B981', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Verify</button>
                  <button onClick={() => performAction(`/api/payments/${t._id}/revoke`, 'PATCH')} style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
