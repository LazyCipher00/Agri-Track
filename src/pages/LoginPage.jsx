import { useState } from 'react';
import { Icon, icons } from '../components/Icon';
import { Field, inputClass } from '../components/Field';

function LoginPage({ onNavigate, onLogin, notify }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.email || !form.password) { notify('Please fill in all fields', 'error'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify('Welcome back! Redirecting to dashboard…', 'success');
      setTimeout(() => onLogin({ name: 'Eric Farmer', email: form.email, role: 'Admin' }), 800);
    }, 1200);
  };

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
        .login-input {
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
        .login-input:focus { border-color: #2d7a3a; box-shadow: 0 0 0 3px rgba(45,122,58,0.12); }
        .login-input::placeholder { color: #aab8ae; }
        .login-btn {
          width: 100%;
          background: #1e5c29;
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
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(30,92,41,0.22);
        }
        .login-btn:hover:not(:disabled) { background: #174d21; box-shadow: 0 6px 24px rgba(30,92,41,0.3); }
        .login-btn:disabled { background: #7aab82; box-shadow: none; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      {/* Left Panel */}
      <div style={{ width: '45%', background: '#0f2d1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(34,113,60,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.jpg" alt="AgriTrack" style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <p className="serif" style={{ fontSize: 18, color: '#fff', fontWeight: 600, lineHeight: 1, margin: 0 }}>AgriTrack</p>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#7fcf90', textTransform: 'uppercase', margin: 0 }}>Farm Intelligence</p>
          </div>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#7fcf90', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Welcome back</p>
          <h2 className="serif" style={{ fontSize: '2.6rem', color: '#fff', fontWeight: 700, lineHeight: 1.2, margin: '0 0 1.25rem' }}>
            Your farm is<br /><span style={{ color: '#7fcf90', fontStyle: 'italic' }}>waiting for you.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(200,225,208,0.8)', lineHeight: 1.75, maxWidth: 320, margin: '0 0 2.5rem' }}>
            Pick up where you left off. Monitor crops, track activity, and manage your harvest — all in one dashboard.
          </p>
          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['500+ Farmers', '95% Accuracy', '3× Efficiency'].map(s => (
              <span key={s} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '6px 14px', fontSize: 12, color: '#a8d5b0', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
            <Icon path={icons.user} size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Eric Farmer</p>
            <p style={{ fontSize: 11, color: 'rgba(160,210,175,0.6)', margin: 0 }}>Demo: any email & password works</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#f7fbf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="fade-up-1" style={{ marginBottom: '2.5rem' }}>
            <h1 className="serif" style={{ fontSize: '2rem', color: '#0f2d1a', fontWeight: 700, margin: '0 0 0.4rem' }}>Sign in</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Enter your credentials to access your dashboard</p>
          </div>

          <div className="fade-up-2" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a34', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                <Icon path={icons.mail} size={15} />
              </span>
              <input className="login-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="fade-up-3" style={{ marginBottom: '1.75rem' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a34', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                <Icon path={icons.lock} size={15} />
              </span>
              <input className="login-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <div className="fade-up-4">
            <button className="login-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? (<><span className="spinner" /> Signing in…</>) : (<>Sign In <Icon path={icons.arrowRight} size={16} /></>)}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: '1.5rem' }}>
              Don't have an account?{' '}
              <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: '#1e5c29', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>
                Create one
              </button>
            </p>
            <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <button onClick={() => onNavigate('landing')} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Back to home
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;