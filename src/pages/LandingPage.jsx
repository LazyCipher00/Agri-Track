import { useEffect, useState, useRef } from 'react';
import { Icon, icons } from '../components/Icon';

function LandingPage({ onNavigate }) {
  const features = [
    { icon: icons.seedling, title: "Crop Lifecycle Tracking", desc: "Monitor every stage from planting to harvest with precision and ease." },
    { icon: icons.heart, title: "Health Monitoring", desc: "Track crop health, detect pests and diseases early, and act fast." },
    { icon: icons.tasks, title: "Activity Logging", desc: "Keep a complete history of irrigation, fertilization, and all farm activities." },
    { icon: icons.warehouse, title: "Inventory Management", desc: "Manage post-harvest stock levels and ensure nothing goes to waste." },
    { icon: icons.sales, title: "Sales & Profit Tracking", desc: "Record transactions and gain insight into your farm's financial performance." },
    { icon: icons.chart, title: "Dashboard & Reports", desc: "Get a bird's-eye view of your entire farm operation in one place." },
  ];

  const steps = [
    { num: "01", title: "Register & Set Up", desc: "Create your account and configure your farm plots in minutes." },
    { num: "02", title: "Plant & Monitor", desc: "Log crops, track activities, and monitor health throughout the season." },
    { num: "03", title: "Harvest & Sell", desc: "Record your harvest, manage inventory, and track every transaction." },
  ];

  const stats = [
    { value: "500+", label: "Farmers Using AgriTrack" },
    { value: "95%", label: "Prediction Accuracy" },
    { value: "24/7", label: "Live Farm Data" },
    { value: "3×", label: "Efficiency Gained" },
  ];

  const ticker = ["Crop Monitoring", "Yield Forecasting", "Pest Detection", "Inventory Control", "Sales Analytics", "Activity Logs", "Farm Reports", "Health Alerts"];

  const heroImages = ['/imgs/1.png', '/imgs/2.png', '/imgs/3.png', '/imgs/4.png', '/imgs/5.png'];
  const [activeImage, setActiveImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f4efe6', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden', color: '#0d1f0f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-deep: #0d2410;
          --green-mid: #1a4a22;
          --green-bright: #2d7a3a;
          --green-light: #4caf6f;
          --cream: #f4efe6;
          --cream-dark: #e8e0d0;
          --gold: #b8962e;
          --gold-light: #d4af52;
          --text: #0d2410;
          --text-muted: #5a7060;
          --serif: 'DM Serif Display', serif;
          --sans: 'DM Sans', sans-serif;
        }

        /* Grain overlay */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* Nav */
        .at-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.4s ease;
        }
        .at-nav.scrolled {
          background: rgba(244, 239, 230, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(13,36,16,0.08);
          box-shadow: 0 2px 40px rgba(13,36,16,0.06);
        }
        .at-nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .at-nav-link {
          font-size: 13px;
          font-weight: 500;
          color: rgba(244,239,230,0.75);
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .at-nav.scrolled .at-nav-link { color: var(--text-muted); }
        .at-nav-link:hover { color: var(--green-bright); }
        .at-nav.scrolled .at-nav-link:hover { color: var(--green-deep); }

        /* Hero */
        .at-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: stretch;
          overflow: hidden;
        }
        .at-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 30%;
          transition: opacity 1.4s ease;
        }
        .at-hero-bg-prev {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 30%;
          opacity: 0;
        }
        /* Subtle left gradient only — photo stays vivid on right */
        .at-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(6,20,9,0.72) 0%,
            rgba(6,20,9,0.48) 38%,
            rgba(6,20,9,0.12) 62%,
            rgba(6,20,9,0.0) 100%
          );
          pointer-events: none;
        }
        /* Thin top bar fade for nav legibility */
        .at-hero-topfade {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, rgba(4,14,6,0.45), transparent);
          pointer-events: none;
        }
        /* Bottom info bar */
        .at-hero-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(8, 24, 11, 0.55);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 1.25rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          z-index: 3;
        }
        .at-hero-bar-stats {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        .at-hero-bar-stat {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .at-hero-bar-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4caf6f;
          animation: pulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .at-hero-bar-stat-label {
          font-size: 12px;
          color: rgba(200,230,210,0.65);
          font-weight: 400;
          letter-spacing: 0.04em;
        }
        .at-hero-bar-stat-value {
          font-size: 13px;
          color: #fff;
          font-weight: 600;
          margin-left: 2px;
        }
        .at-hero-content {
          position: relative;
          z-index: 2;
          padding: 10rem 2.5rem 8rem;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .at-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin-bottom: 1.5rem;
        }
        .at-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--gold-light);
        }
        .at-hero-title {
          font-family: var(--serif);
          font-size: clamp(3.2rem, 6.5vw, 6.2rem);
          color: #fff;
          line-height: 1.04;
          margin-bottom: 2rem;
          font-weight: 400;
          max-width: 680px;
          text-shadow: 0 2px 24px rgba(0,0,0,0.18);
        }
        .at-hero-title em {
          font-style: italic;
          color: #8ee8a4;
        }
        .at-hero-sub {
          font-size: 16px;
          color: rgba(215,240,222,0.78);
          line-height: 1.75;
          max-width: 420px;
          font-weight: 300;
          margin-bottom: 2.5rem;
        }
        .at-hero-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          color: var(--green-deep);
          font-family: var(--sans);
          font-weight: 600;
          font-size: 14px;
          padding: 14px 28px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-primary:hover {
          background: var(--cream);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: rgba(255,255,255,0.85);
          font-family: var(--sans);
          font-weight: 500;
          font-size: 14px;
          padding: 14px 28px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }
        .btn-outline:hover {
          border-color: rgba(255,255,255,0.7);
          color: #fff;
        }
        .btn-green {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--green-mid);
          color: #fff;
          font-family: var(--sans);
          font-weight: 600;
          font-size: 14px;
          padding: 13px 24px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }
        .btn-green:hover {
          background: var(--green-deep);
          transform: translateY(-1px);
        }

        /* Ticker */
        .at-ticker {
          background: var(--green-deep);
          padding: 0;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .at-ticker-inner {
          display: flex;
          animation: ticker 28s linear infinite;
          white-space: nowrap;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .at-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 28px;
          padding: 14px 0;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(168,224,180,0.6);
          flex-shrink: 0;
        }
        .at-ticker-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
        }

        /* Stats */
        .at-stats {
          background: var(--cream);
          border-bottom: 1px solid var(--cream-dark);
        }
        .at-stats-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 2.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .at-stat {
          padding: 1.5rem 2.5rem;
          border-right: 1px solid var(--cream-dark);
        }
        .at-stat:last-child { border-right: none; }
        .at-stat-num {
          font-family: var(--serif);
          font-size: 3.25rem;
          color: var(--green-mid);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .at-stat-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Section label */
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--green-bright);
          margin-bottom: 1.25rem;
        }
        .section-label::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--green-bright);
        }

        /* Features */
        .at-features {
          background: var(--cream);
          padding: 7rem 2.5rem;
        }
        .at-features-inner { max-width: 1280px; margin: 0 auto; }
        .at-features-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: end;
          margin-bottom: 4rem;
        }
        .at-features-title {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 3.5vw, 3.2rem);
          color: var(--green-deep);
          line-height: 1.15;
        }
        .at-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--cream-dark);
          border: 1px solid var(--cream-dark);
          border-radius: 8px;
          overflow: hidden;
        }
        .at-feature-card {
          background: var(--cream);
          padding: 2.25rem 2rem;
          transition: background 0.2s;
          cursor: default;
        }
        .at-feature-card:hover {
          background: #fff;
        }
        .at-feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: rgba(26,74,34,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--green-mid);
          margin-bottom: 1.25rem;
        }
        .at-feature-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--green-deep);
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }
        .at-feature-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.7;
          font-weight: 300;
        }

        /* Gallery */
        .at-gallery {
          background: var(--green-deep);
          padding: 7rem 2.5rem;
        }
        .at-gallery-inner { max-width: 1280px; margin: 0 auto; }
        .at-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          margin-bottom: 6rem;
        }
        .at-split:last-child { margin-bottom: 0; }
        .at-split-img {
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }
        .at-split-img img {
          display: block;
          width: 100%;
          height: 400px;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .at-split-img:hover img { transform: scale(1.04); }
        .at-split-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold-light);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.25rem;
        }
        .at-split-tag::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: var(--gold-light);
        }
        .at-split-title {
          font-family: var(--serif);
          font-size: clamp(1.75rem, 2.5vw, 2.4rem);
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .at-split-desc {
          font-size: 15px;
          color: rgba(200,225,208,0.72);
          line-height: 1.8;
          font-weight: 300;
          margin-bottom: 1.75rem;
        }
        .at-fullimg {
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }
        .at-fullimg img {
          display: block;
          width: 100%;
          height: 460px;
          object-fit: cover;
        }
        .at-fullimg-caption {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 40%, rgba(5,18,7,0.88));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
        }

        /* How it works */
        .at-how {
          background: var(--cream);
          padding: 7rem 2.5rem;
        }
        .at-how-inner { max-width: 1280px; margin: 0 auto; }
        .at-how-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: end;
          margin-bottom: 4rem;
        }
        .at-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .at-step {
          background: #fff;
          border: 1px solid var(--cream-dark);
          padding: 2.5rem 2rem;
          position: relative;
          transition: border-color 0.2s;
        }
        .at-step:hover { border-color: var(--green-bright); }
        .at-step-num {
          font-family: var(--serif);
          font-style: italic;
          font-size: 5rem;
          color: rgba(26,74,34,0.1);
          line-height: 1;
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
        }
        .at-step-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--green-deep);
          margin-bottom: 0.75rem;
          margin-top: 1rem;
        }
        .at-step-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.75;
          font-weight: 300;
        }
        .at-step-bar {
          width: 32px;
          height: 2px;
          background: var(--green-bright);
          margin-bottom: 1.5rem;
        }

        /* CTA */
        .at-cta {
          background: var(--green-deep);
          padding: 7rem 2.5rem;
        }
        .at-cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .at-cta-title {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          color: #fff;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }
        .at-cta-title em {
          font-style: italic;
          color: #a8e0b4;
        }
        .at-cta-img {
          border-radius: 6px;
          overflow: hidden;
        }
        .at-cta-img img {
          display: block;
          width: 100%;
          height: 340px;
          object-fit: cover;
        }

        /* Footer */
        .at-footer {
          background: #05110a;
          padding: 2.5rem 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .at-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* Logo wordmark */
        .at-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .at-logo-mark {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .at-logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .at-logo-name {
          font-family: var(--serif);
          font-size: 18px;
          color: var(--green-deep);
          line-height: 1;
        }
        .at-logo-tag {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--green-bright);
          margin-top: 2px;
          font-weight: 500;
        }
        .at-logo.light .at-logo-name { color: #fff; }
        .at-logo.light .at-logo-tag { color: rgba(168,224,180,0.7); }

        /* Scroll indicator */
        .at-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .at-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .fade-2 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.28s both; }
        .fade-3 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.46s both; }
        .fade-4 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.62s both; }

        /* Nav sign-in */
        .nav-signin {
          font-size: 13px;
          font-weight: 500;
          color: rgba(244,239,230,0.7);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 14px;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          font-family: var(--sans);
        }
        .at-nav.scrolled .nav-signin { color: var(--text-muted); }
        .nav-signin:hover { color: #fff; }
        .at-nav.scrolled .nav-signin:hover { color: var(--green-deep); }
        .nav-cta {
          font-size: 13px;
          font-weight: 600;
          color: var(--cream);
          background: var(--green-mid);
          border: none;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 4px;
          letter-spacing: 0.06em;
          transition: background 0.2s;
          font-family: var(--sans);
        }
        .nav-cta:hover { background: var(--green-deep); }

        .divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 5rem 0;
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className={`at-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="at-nav-inner">
          <div className="at-logo">
            <div className="at-logo-mark">
              <img src="/logo.jpg" alt="AgriTrack" />
            </div>
            <div>
              <div className="at-logo-name" style={{ color: scrolled ? 'var(--green-deep)' : '#fff' }}>AgriTrack</div>
              <div className="at-logo-tag" style={{ color: scrolled ? 'var(--green-bright)' : 'rgba(168,224,180,0.7)' }}>Farm Intelligence</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 36 }}>
            {['Features', 'Gallery', 'How It Works'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g,'')}`} className="at-nav-link">{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="nav-signin" onClick={() => onNavigate('login')}>Sign In</button>
            <button className="nav-cta" onClick={() => onNavigate('register')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="at-hero" ref={heroRef}>
        <div
          className="at-hero-bg"
          style={{ backgroundImage: `url(${heroImages[activeImage]})` }}
        />
        <div className="at-hero-gradient" />
        <div className="at-hero-topfade" />

        {/* Slim vertical image dots — right edge */}
        <div style={{
          position: 'absolute', top: '50%', right: '2rem',
          transform: 'translateY(-50%)',
          zIndex: 3,
          display: 'flex', flexDirection: 'column', gap: 6,
          alignItems: 'center',
        }}>
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              style={{
                width: 2,
                height: i === activeImage ? 32 : 8,
                borderRadius: 10,
                background: i === activeImage ? '#fff' : 'rgba(255,255,255,0.28)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="at-hero-content">
          <div className="fade-1">
            <div className="at-eyebrow">Smart Farm Operations</div>
          </div>
          <h1 className="at-hero-title fade-2">
            Grow with clarity,<br />
            not <em>guesswork.</em>
          </h1>
          <p className="at-hero-sub fade-3">
            AgriTrack is your modern farm command center — from crop health and inventory to activity logs and profit tracking, all in one seamless platform.
          </p>
          <div className="at-hero-actions fade-4">
            <button className="btn-primary" onClick={() => onNavigate('register')}>
              Get Started Free
              <Icon path={icons.arrowRight} size={15} />
            </button>
          </div>
        </div>

        {/* Frosted glass bottom bar */}
        <div className="at-hero-bar">
          <div className="at-hero-bar-stats">
            {[
              { label: 'Crop Health', value: '98% Optimal' },
              { label: 'Active Plots', value: '12 Monitored' },
              { label: 'Next Harvest', value: 'In 14 days' },
            ].map((s, i) => (
              <div key={i} className="at-hero-bar-stat">
                <div className="at-hero-bar-stat-dot" style={{ animationDelay: `${i * 0.6}s` }} />
                <span className="at-hero-bar-stat-label">{s.label} —</span>
                <span className="at-hero-bar-stat-value">{s.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf6f' }} />
            <span style={{ fontSize: 11, color: 'rgba(200,230,210,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>Live data · Updated now</span>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="at-ticker">
        <div className="at-ticker-inner">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="at-ticker-item">
              {item} <span className="at-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="at-stats">
        <div className="at-stats-grid">
          {stats.map(s => (
            <div key={s.value} className="at-stat">
              <div className="at-stat-num">{s.value}</div>
              <div className="at-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="Features" className="at-features">
        <div className="at-features-inner">
          <div className="at-features-header">
            <div>
              <div className="section-label">Everything You Need</div>
              <h2 className="at-features-title">
                All the tools your farm needs,<br />in one interface.
              </h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 300, maxWidth: 420 }}>
              From crop tracking to sales and inventory, AgriTrack keeps your daily farm work organized and visually clear — so you can focus on what grows.
            </p>
          </div>
          <div className="at-features-grid">
            {features.map((f, i) => (
              <div key={i} className="at-feature-card">
                <div className="at-feature-icon">
                  <Icon path={f.icon} size={20} />
                </div>
                <div className="at-feature-title">{f.title}</div>
                <div className="at-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery / Split Sections ── */}
      <section id="Gallery" className="at-gallery">
        <div className="at-gallery-inner">
          <div style={{ marginBottom: '5rem' }}>
            <div className="at-split-tag">See It In Action</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: '#fff', fontWeight: 400, maxWidth: 560, lineHeight: 1.15 }}>
              Built for how farmers <em style={{ fontStyle: 'italic', color: '#a8e0b4' }}>actually</em> work.
            </h2>
          </div>

          {/* Row 1 */}
          <div className="at-split">
            <div className="at-split-img">
              <img src="/imgs/2.png" alt="Crop monitoring interface" />
            </div>
            <div>
              <div className="at-split-tag">Real-time Monitoring</div>
              <h3 className="at-split-title">Know what's happening in your fields at all times.</h3>
              <p className="at-split-desc">
                Get alerts for pest activity, nutrient deficiencies, and weather risks before they become costly problems. Your farm data, always current.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="at-split" style={{ direction: 'rtl' }}>
            <div className="at-split-img" style={{ direction: 'ltr' }}>
              <img src="/imgs/3.png" alt="Inventory management screen" />
            </div>
            <div style={{ direction: 'ltr' }}>
              <div className="at-split-tag">Smart Inventory</div>
              <h3 className="at-split-title">From harvest to storage — every kilogram accounted for.</h3>
              <p className="at-split-desc">
                Log post-harvest stock, track outgoing sales, and set low-inventory alerts so nothing goes to waste or falls through the cracks.
              </p>
            </div>
          </div>

          {/* Full width */}
          <div className="at-fullimg">
            <img src="/imgs/4.png" alt="Farm dashboard" />
            <div className="at-fullimg-caption">
              <div className="at-split-tag" style={{ marginBottom: '0.75rem' }}>Dashboard & Reports</div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: '#fff', fontWeight: 400, maxWidth: 580, lineHeight: 1.25 }}>
                Your entire farm operation, visible in one glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="HowItWorks" className="at-how">
        <div className="at-how-inner">
          <div className="at-how-header">
            <div>
              <div className="section-label">Simple Process</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: 'var(--green-deep)', lineHeight: 1.1 }}>
                Up and running<br />in three steps.
              </h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 300, maxWidth: 380 }}>
              No complicated setup. No training required. Just sign up, configure your farm, and start tracking from day one.
            </p>
          </div>
          <div className="at-steps">
            {steps.map((s, i) => (
              <div key={i} className="at-step">
                <div className="at-step-num">{s.num}</div>
                <div className="at-step-bar" />
                <div className="at-step-title">{s.title}</div>
                <div className="at-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="at-cta">
        <div className="at-cta-inner">
          <div>
            <div className="at-eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1.5rem' }}>Get Started Today</div>
            <h2 className="at-cta-title">
              Ready to grow<br />with <em>AgriTrack?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(200,225,208,0.72)', lineHeight: 1.8, fontWeight: 300, margin: '1.25rem 0 2.25rem', maxWidth: 400 }}>
              Create your farm profile and experience what organized, data-driven farming feels like.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => onNavigate('register')}>
                Create Your Account
                <Icon path={icons.arrowRight} size={15} />
              </button>
            </div>
          </div>
          <div className="at-cta-img">
            <img src="/imgs/5.png" alt="Farmer using AgriTrack" />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="at-footer">
        <div className="at-footer-inner">
          <div className="at-logo light">
            <div className="at-logo-mark">
              <img src="/logo.jpg" alt="AgriTrack" />
            </div>
            <div>
              <div className="at-logo-name">AgriTrack</div>
              <div className="at-logo-tag">Natural Farm Intelligence</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
            © 2026 AgriTrack. Smart Crop Lifecycle Management.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;