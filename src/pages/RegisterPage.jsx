import { useState } from 'react';
import { Icon, icons } from '../components/Icon';
import { Field, inputClass } from '../components/Field';

function RegisterPage({ onNavigate, onLogin, notify }) {
  const [form, setForm] = useState({ name: '', email: '', farmName: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) { notify('Please fill in all required fields', 'error'); return; }
    if (form.password !== form.confirm) { notify('Passwords do not match', 'error'); return; }
    if (form.password.length < 6) { notify('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify('Account created successfully! Welcome!', 'success');
      setTimeout(() => onLogin({ name: form.name, email: form.email, role: 'Farmer' }), 800);
    }, 1400);
  };

  const perks = [
    { icon: icons.seedling, text: 'Track every crop from seed to sale' },
    { icon: icons.heart,    text: 'Monitor health and prevent losses' },
    { icon: icons.chart,    text: 'Make data-driven farming decisions' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .fa1 { animation: fadeUp 0.6s ease 0.1s both; }
        .fa2 { animation: fadeUp 0.6s ease 0.2s both; }
        .fa3 { animation: fadeUp 0.6s ease 0.3s both; }
        .fa4 { animation: fadeUp 0.6s ease 0.4s both; }
        .fa5 { animation: fadeUp 0.6s ease 0.5s both; }
        .reg-input {
          width: 100%;
          padding: 11px 14px;
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
        .reg-input-icon {
          width: 100%;
          padding: 11px 14px 11px 42px;
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
        .reg-input:focus, .reg-input-icon:focus { border-color: #2d7a3a; box-shadow: 0 0 0 3px rgba(45,122,58,0.12); }
        .reg-input::placeholder, .reg-input-icon::placeholder { color: #aab8ae; }
        .reg-label { font-size: 13px; font-weight: 600; color: #2d4a34; display: block; margin-bottom: 5px; }
        .reg-btn {
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
        .reg-btn:hover:not(:disabled) { background: #174d21; box-shadow: 0 6px 24px rgba(30,92,41,0.3); }
        .reg-btn:disabled { background: #7aab82; box-shadow: none; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      {/* Left Panel */}
      <div style={{ width: '45%', background: '#0f2d1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 20% 60%, rgba(34,113,60,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
          <p style={{ fontSize: 11, fontWeight: 600, color: '#7fcf90', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Get started today</p>
          <h2 className="serif" style={{ fontSize: '2.6rem', color: '#fff', fontWeight: 700, lineHeight: 1.2, margin: '0 0 1.5rem' }}>
            Start your<br /><span style={{ color: '#7fcf90', fontStyle: 'italic' }}>farming journey.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {perks.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(127,207,144,0.15)', border: '1px solid rgba(127,207,144,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#7fcf90' }}>
                  <Icon path={p.icon} size={15} />
                </div>
                <p style={{ fontSize: 14, color: 'rgba(200,225,208,0.85)', margin: 0, lineHeight: 1.4 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 12, color: 'rgba(160,210,175,0.5)', margin: 0 }}>Join 500+ farmers already using AgriTrack</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#f7fbf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420, padding: '1rem 0' }}>
          <div className="fa1" style={{ marginBottom: '2rem' }}>
            <h1 className="serif" style={{ fontSize: '2rem', color: '#0f2d1a', fontWeight: 700, margin: '0 0 0.4rem' }}>Create account</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Set up your farm management profile</p>
          </div>

          {/* Full Name */}
          <div className="fa2" style={{ marginBottom: '1.1rem' }}>
            <label className="reg-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                <Icon path={icons.user} size={15} />
              </span>
              <input className="reg-input-icon" placeholder="John Farmer" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          {/* Email */}
          <div className="fa2" style={{ marginBottom: '1.1rem' }}>
            <label className="reg-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                <Icon path={icons.mail} size={15} />
              </span>
              <input className="reg-input-icon" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          {/* Farm Name */}
          <div className="fa3" style={{ marginBottom: '1.1rem' }}>
            <label className="reg-label" style={{ fontWeight: 500, color: '#5a7a62' }}>Farm Name <span style={{ fontWeight: 400, fontSize: 12 }}>(optional)</span></label>
            <input className="reg-input" placeholder="e.g. Green Valley Farm" value={form.farmName} onChange={e => setForm({ ...form, farmName: e.target.value })} />
          </div>

          {/* Password row */}
          <div className="fa4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.75rem' }}>
            <div>
              <label className="reg-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aab92', display: 'flex' }}>
                  <Icon path={icons.lock} size={15} />
                </span>
                <input className="reg-input-icon" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="reg-label">Confirm *</label>
              <input className="reg-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
          </div>

          <div className="fa5">
            <button className="reg-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? (<><span className="spinner" /> Creating account…</>) : (<>Create Account <Icon path={icons.arrowRight} size={16} /></>)}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: '1.5rem' }}>
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: '#1e5c29', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>
                Sign in
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

export default RegisterPage;