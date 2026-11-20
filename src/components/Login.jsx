import { useState } from 'react';

export default function Login({ onGoogleLogin, onBack }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogleClick() {
    setError('');
    setLoading(true);
    try {
      await onGoogleLogin();
    } catch (err) {
      // hindi error kapag sinadyang isara ng user ang popup
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const featureBoxes = [
    {
      title: 'Free WiFi',
      text: 'All our rooms come with free WiFi.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12" y2="20" />
        </svg>
      )
    },
    {
      title: 'Easy Location',
      text: 'Our apartments are located in accessible areas.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    },
    {
      title: 'Noise Levels',
      text: 'We keep the environment peaceful and quiet.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )
    }
  ];

  return (
    <div id="view-login" className="row g-0">
      <div className="login-art col-12 col-lg-6 d-none d-lg-flex">
        <div className="login-art-top">
          <div className="login-brand-row">
            <div className="brand-logo-mark" aria-hidden="true">
              <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('logo-fallback'); }} />
            </div>
            <div>
              <div className="login-brand">EasePlace Boarding House</div>
              <span className="system-tag">Reservation System</span>
            </div>
          </div>
          <p className="login-tagline">Providing comfort, cleanliness and safety for every guest. Our spaces are designed to feel warm, and make everyone feel like home.</p>
        </div>

        <div className="login-feature-boxes">
          {featureBoxes.map((f) => (
            <div className="feature-box" key={f.title}>
              <div className="icon" aria-hidden="true">
                {f.icon}
              </div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="login-foot">EasePlace Reservation &amp; Monitoring System</div>
      </div>

      <div className="login-art-compact col-12 d-flex d-lg-none">
        <div className="login-brand-row">
          <div className="brand-logo-mark" aria-hidden="true">
            <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('logo-fallback'); }} />
          </div>
          <div>
            <div className="login-brand">EasePlace Boarding House</div>
            <span className="system-tag">Reservation System</span>
          </div>
        </div>
        <div className="login-features-compact">
          <div className="mini-feature"><span>Free WiFi</span></div>
          <div className="mini-feature"><span>Easy Location</span></div>
          <div className="mini-feature"><span>Quiet Environment</span></div>
        </div>
      </div>

      <div className="login-panel col-12 col-lg-6 d-flex">
        <div
          className="login-card"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: 'clamp(24px, 5vw, 40px)',
            maxWidth: 420,
          }}
        >
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{ background: 'none', border: 'none', padding: 0, marginBottom: 24, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)' }}
            >
              ← Back to home
            </button>
          )}

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 id="login-heading" style={{ fontSize: 30, marginBottom: 8 }}>Welcome!</h2>
            <p className="login-sub" id="login-subtext" style={{ margin: 0 }}>
              Sign in to browse rooms and manage your reservations.
            </p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="button"
            className="btn btn-ghost"
            disabled={loading}
            style={{
              width: '100%', minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, background: '#fff', fontWeight: 600, fontSize: 15,
            }}
            onClick={handleGoogleClick}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3C13.7 15.6 18.5 12.2 24 12.2c3.1 0 5.9 1.2 8.1 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4c-7.4 0-13.7 4-17.7 10.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.3 0-9.6-3-11.3-7.3l-6.1 4.7C10.1 39.9 16.6 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1 3-3 5.5-5.9 7.1l6.2 5.2C39.7 37.1 44 31.3 44 24c0-1.3-.1-2.7-.4-3.5z" />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p style={{ margin: '16px 0 0', padding: '12px 14px', background: 'var(--forest-tint)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--forest-dark)', textAlign: 'center' }}>
            New here? Your boarder account is created automatically the first time you sign in.
          </p>

          <div style={{ borderTop: '1px solid var(--line)', marginTop: 28, paddingTop: 18 }}>
            <p className="login-help-link" style={{ margin: 0 }}>
              Need help signing in? <a href="mailto:zeirapiana@gmail.com">Contact the property manager</a>
            </p>
            <p className="login-mini-foot" style={{ marginTop: 8, marginBottom: 0 }}>© 2026 EasePlace Boarding House. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}