import { useState, useEffect } from 'react';
import { Icon, icons } from '../components/Icon';
import { authAPI, otpAPI } from '../services/api';

function VerifyOTP({ email, onVerified, onBack, notify, purpose = 'Login' }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      notify('Please enter the 6-digit code', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP({ email, otpCode, purpose });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      notify('Verification successful!', 'success');
      onVerified(response.user);
    } catch (error) {
      notify(error.message || 'Invalid verification code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await otpAPI.resend(email, purpose);
      notify('New verification code sent!', 'success');
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      notify(error.message || 'Failed to resend code', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Outfit',sans-serif]">
      {/* Left Panel */}
      <div className="w-[45%] bg-[#0f2d1a] flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_70%,rgba(34,113,60,0.4)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <img src="/logo.jpg" alt="AgriTrack" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="font-['Playfair_Display',serif] text-[18px] text-white font-semibold leading-none m-0">AgriTrack</p>
            <p className="text-[10px] tracking-[0.18em] text-[#7fcf90] uppercase m-0">Admin Portal</p>
          </div>
        </div>

        <div className="relative">
          <p className="text-[11px] font-semibold text-[#7fcf90] uppercase tracking-[0.2em] mb-4">Two-Factor Authentication</p>
          <h2 className="font-['Playfair_Display',serif] text-[2.6rem] text-white font-bold leading-tight m-0 mb-5">
            Verify your<br /><span className="text-[#7fcf90] italic">identity.</span>
          </h2>
          <p className="text-[15px] text-[rgba(200,225,208,0.8)] leading-relaxed max-w-[320px] m-0 mb-10">
            We've sent a 6-digit verification code to your email address. Please enter it below to continue.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <span className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] rounded-full px-[14px] py-1.5 text-xs text-[#a8d5b0] font-medium">
              Secure Admin Access
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center border border-[rgba(255,255,255,0.12)]">
            <Icon path={icons.mail} size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white m-0">Code sent to:</p>
            <p className="text-[11px] text-[rgba(160,210,175,0.6)] m-0">{email}</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-[#f7fbf4] flex items-center justify-center p-12 px-8">
        <div className="w-full max-w-[420px]">
          <div className="animate-[fadeUp_0.6s_ease_both] mb-10">
            <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[#0f2d1a] font-bold m-0 mb-1">Enter Code</h1>
            <p className="text-sm text-[#6b7280] m-0">Enter the 6-digit code sent to your email</p>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_both] mb-8">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-[50px] h-[60px] text-center text-2xl font-semibold border-2 border-[#d1ddd4] rounded-xl bg-white text-[#0f2d1a] outline-none transition-all duration-200 focus:border-[#2d7a3a] focus:shadow-[0_0_0_3px_rgba(45,122,58,0.12)] focus:scale-105 font-['Outfit',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_both]">
            <button 
              className="w-full bg-[#1e5c29] text-white font-['Outfit',sans-serif] font-bold text-[15px] py-3.5 px-4 border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#174d21] hover:shadow-[0_6px_24px_rgba(30,92,41,0.3)] disabled:bg-[#7aab82] disabled:shadow-none disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(30,92,41,0.22)]"
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <Icon path={icons.arrowRight} size={16} />
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="bg-none border-none text-[#1e5c29] font-semibold cursor-pointer text-sm p-0 hover:underline"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-[13px] text-[#6b7280] m-0">
                  Resend code in {timer}s
                </p>
              )}
            </div>

            <p className="text-center mt-6">
              <button
                onClick={onBack}
                className="bg-none border-none text-[#9ca3af] text-[13px] cursor-pointer font-inherit hover:text-[#6b7280] transition-colors"
              >
                ← Back to login
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

export default VerifyOTP;