import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Payment() {
  const [mpesaCode, setMpesaCode] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserId(parsed.id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    try {
      // Updated URL to production backend
      const response = await fetch('https://fourrealbackend.onrender.com/api/payments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          mpesaCode,
          amount: 15000
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment submission failed');
      }

      setSuccess('Transaction code submitted successfully. Your dashboard will refresh once verified by an admin.');
      setMpesaCode('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 20px' }}>
      <div className="corporate-card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#1E2530' }}>
            Activate Membership
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Package Cost: KES 15,000 / Year</p>
        </div>

        <div style={{ background: '#F4F6F9', border: '1px solid #E5E7EB', padding: '20px', borderRadius: '8px', marginBottom: '28px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#1A5632' }}>M-PESA Payment Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
            <li>Send premium total to the designated 4REAL business till.</li>
            <li>Copy the 10-digit alphanumeric transaction code.</li>
            <li>Paste the verification code below to update your status.</li>
          </ol>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FCE8E6', border: '1px solid #EA4335', padding: '12px 16px', borderRadius: '6px', color: '#C5221F', marginBottom: '24px' }}>
            <ShieldAlert size={20} />
            <span style={{ fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'start', gap: '10px', background: '#E6F4EA', border: '1px solid #34A853', padding: '12px 16px', borderRadius: '6px', color: '#137333', marginBottom: '24px' }}>
            <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Transaction Code</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input type="text" required placeholder="e.g. QX78XYZ901" className="corporate-input" value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value)} style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box', textTransform: 'uppercase' }} />
            </div>
          </div>

          <button type="submit" className="corporate-btn-primary" style={{ marginTop: '10px', width: '100%' }}>
            Submit Reference Code
          </button>
        </form>
      </div>
    </div>
  );
}