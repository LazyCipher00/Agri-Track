import { useState } from 'react';
import { Icon, icons } from '../components/Icon';
import { Field, inputClass } from '../components/Field';
import { authAPI } from '../services/api';
import VerifyOTP from './VerifyOTP';

function LoginPage({ onNavigate, onLogin, notify }) {
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
      
      // Check if OTP is required (e.g., for admin users)
      if (response.requiresOTP) {
        setPendingEmail(response.email);
        setShowOTP(true);
        notify('Verification code sent to your email', 'success');
      } else {
        // Direct login successful
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        notify('Welcome back! Redirecting to dashboard…', 'success');
        setTimeout(() => onLogin(response.user), 600);
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
    <div className="min-h-screen flex font-['Outfit',sans-serif]">
      {/* Left Panel */}
      <div className="w-[45%] bg-[#0f2d1a] flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_70%,rgba(34,113,60,0.4)_0%,transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <img src="/logo.jpg" alt="AgriTrack" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="font-['Playfair_Display',serif] text-[18px] text-white font-semibold leading-none m-0">AgriTrack</p>
            <p className="text-[10px] tracking-[0.18em] text-[#7fcf90] uppercase m-0">Farm Intelligence</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative">
          <p className="text-[11px] font-semibold text-[#7fcf90] uppercase tracking-[0.2em] mb-4">Welcome back</p>
          <h2 className="font-['Playfair_Display',serif] text-[2.6rem] text-white font-bold leading-tight m-0 mb-5">
            Your farm is<br /><span className="text-[#7fcf90] italic">waiting for you.</span>
          </h2>
          <p className="text-[15px] text-[rgba(200,225,208,0.8)] leading-relaxed max-w-[320px] m-0 mb-10">
            Pick up where you left off. Monitor crops, track activity, and manage your harvest all in one dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-[#f7fbf4] flex items-center justify-center p-12 px-8">
        <div className="w-full max-w-[400px]">
          <div className="animate-[fadeUp_0.6s_ease_0.1s_both] mb-10">
            <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[#0f2d1a] font-bold m-0 mb-1">Sign in</h1>
            <p className="text-sm text-[#6b7280] m-0">Enter your credentials to access your dashboard</p>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.22s_both] mb-5">
            <label className="text-[13px] font-semibold text-[#2d4a34] block mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8aab92] flex">
                <Icon path={icons.mail} size={15} />
              </span>
              <input 
                className="w-full py-3 px-[14px] pl-[42px] border border-[#d1ddd4] rounded-[10px] text-sm font-['Outfit',sans-serif] bg-white text-[#0f2d1a] outline-none transition-all duration-200 focus:border-[#2d7a3a] focus:shadow-[0_0_0_3px_rgba(45,122,58,0.12)] placeholder:text-[#aab8ae] box-border"
                type="email" 
                placeholder="you@example.com" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
            </div>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.34s_both] mb-7">
            <label className="text-[13px] font-semibold text-[#2d4a34] block mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8aab92] flex">
                <Icon path={icons.lock} size={15} />
              </span>
              <input 
                className="w-full py-3 px-[14px] pl-[42px] border border-[#d1ddd4] rounded-[10px] text-sm font-['Outfit',sans-serif] bg-white text-[#0f2d1a] outline-none transition-all duration-200 focus:border-[#2d7a3a] focus:shadow-[0_0_0_3px_rgba(45,122,58,0.12)] placeholder:text-[#aab8ae] box-border"
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
              />
            </div>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.46s_both]">
            <button 
              className="w-full bg-[#1e5c29] text-white font-['Outfit',sans-serif] font-bold text-[15px] py-3.5 px-4 border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#174d21] hover:shadow-[0_6px_24px_rgba(30,92,41,0.3)] disabled:bg-[#7aab82] disabled:shadow-none disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(30,92,41,0.22)]"
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <Icon path={icons.arrowRight} size={16} /></>
              )}
            </button>

            <p className="text-center text-[13px] text-[#6b7280] mt-6">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('register')} className="bg-none border-none text-[#1e5c29] font-bold cursor-pointer font-inherit text-[13px] p-0">
                Create one
              </button>
            </p>
            <p className="text-center mt-3">
              <button onClick={() => onNavigate('landing')} className="bg-none border-none text-[#9ca3af] text-[13px] cursor-pointer font-inherit">
                ← Back to home
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Add keyframes for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        
        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;