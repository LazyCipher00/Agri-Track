import { useState } from 'react';
import { Icon, icons } from '../components/Icon';
import { authAPI } from '../services/api';
import VerifyOTP from './VerifyOTP';

function AdminLogin({ onNavigate, onLogin, notify }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      notify('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email: form.email, password: form.password });
      
      if (response.requiresOTP) {
        setPendingEmail(response.email);
        setShowOTP(true);
        notify('Verification code sent to your email', 'success');
      } else {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        notify('Welcome back! Redirecting to admin dashboard...', 'success');
        onLogin(response.user);
      }
    } catch (error) {
      notify(error.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (user) => {
    onLogin(user);
  };

  if (showOTP) {
    return (
      <VerifyOTP
        email={pendingEmail}
        onVerified={handleOTPVerified}
        onBack={() => setShowOTP(false)}
        notify={notify}
        purpose="Login"
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.22s both; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.34s both; }
        .fade-up-4 { animation: fadeUp 0.6s ease 0.46s both; }
        .admin-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1px solid #d1ddd4;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          background: #fff;
          color: #0f2d1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .admin-input:focus { border-color: #b8962e; box-shadow: 0 0 0 3px rgba(184,150,46,0.12); }
        .admin-input::placeholder { color: #aab8ae; }
        .admin-btn {
          width: 100%;
          background: linear-gradient(135deg, #b8962e 0%, #d4af52 100%);
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 15px;
          padding: 14px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(184,150,46,0.3);
        }
        .admin-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #a08428 0%, #c49e42 100%);
          box-shadow: 0 6px 24px rgba(184,150,46,0.4);
          transform: translateY(-1px);
        }
        .admin-btn:disabled {
          background: #d4c5a0;
          box-shadow: none;
          cursor: not-allowed;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      {/* Left Panel - Admin Theme */}
      <div style={{ width: '45%', background: 'linear-gradient(135deg, #1a1a0f 0%, #2d2d1a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(184,150,46,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.jpg" alt="AgriTrack" style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <p className="serif" style={{ fontSize: 18, color: '#fff', fontWeight: 600, lineHeight: 1, margin: 0 }}>AgriTrack</p>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#d4af52', textTransform: 'uppercase', margin: 0 }}>Admin Console</p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#d4af52', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Secure Access</p>
          <h2 className="serif" style={{ fontSize: '2.6rem', color: '#fff', fontWeight: 700, lineHeight: 1.2, margin: '0 0 1.25rem' }}>
            Admin<br /><span style={{ color: '#d4af52', fontStyle: 'italic' }}>Portal.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(220,220,200,0.8)', lineHeight: 1.75, maxWidth: 320, margin: '0 0 2.5rem' }}>
            Manage users, monitor system activity, and generate comprehensive reports from the admin dashboard.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['User Management', 'Analytics', 'Reports'].map(s => (
              <span key={s} style={{ background: 'rgba(212,175,82,0.1)', border: '1px solid rgba(212,175,82,0.2)', borderRadius: 100, padding: '6px 14px', fontSize: 12, color: '#d4c5a0', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(212,175,82,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212,175,82,0.25)' }}>
            <Icon path={icons.lock} size={16} style={{ color: '#d4af52' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Two-Factor Authentication</p>
            <p style={{ fontSize: 11, color: 'rgba(212,175,82,0.6)', margin: 0 }}>OTP verification required</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#f7fbf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="fade-up-1" style={{ marginBottom: '2.5rem' }}>
            <h1 className="serif" style={{ fontSize: '2rem', color: '#0f2d1a', fontWeight: 700, margin: '0 0 0.4rem' }}>Admin Sign In</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Enter your administrator credentials</p>
          </div>

          <div className="fade-up-2" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a34', display: 'block', marginBottom: '0.4rem' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                <Icon path={icons.mail} size={15} />
              </span>
              <input
                className="admin-input"
                type="email"
                placeholder="admin@agritrack.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="fade-up-3" style={{ marginBottom: '1.75rem' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a34', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                <Icon path={icons.lock} size={15} />
              </span>
              <input
                className="admin-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div className="fade-up-4">
            <button className="admin-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Admin Portal
                  <Icon path={icons.arrowRight} size={16} />
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => onNavigate('landing')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                ← Back to home
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;