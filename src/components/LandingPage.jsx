export default function LandingPage({ onLoginClick }) {
  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const features = [
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
      ),
    },
    {
      title: 'Easy Location',
      text: 'Our apartments are located in accessible areas.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      title: 'Noise Levels',
      text: 'We keep the environment peaceful and quiet.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ),
    },
  ];

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-nav-brand">EasePlace</div>
        <nav className="landing-nav-links">
          <button type="button" onClick={() => scrollToSection('home')}>Home</button>
          <button type="button" onClick={() => scrollToSection('features')}>Features</button>
          <button type="button" onClick={() => scrollToSection('about')}>About</button>
          <button type="button" className="landing-login-btn" onClick={onLoginClick}>Login</button>
        </nav>
      </header>

      {/* SECTION 1: HERO */}
      <section id="home" className="landing-section">
        <div className="landing-hero-content">
          <div className="login-brand-row">
            <div className="brand-logo-mark" aria-hidden="true">
              <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div>
              <div className="login-brand">EasePlace Boarding House</div>
              <span className="system-tag">Reservation System</span>
            </div>
          </div>
          <h1>Welcome to EasePlace</h1>
          <p className="login-tagline">
            Providing comfort, cleanliness and safety for every guest. Our spaces
            are designed to feel warm, and make everyone feel like home.
          </p>
          <button type="button" className="landing-cta" onClick={onLoginClick}>Login to Reserve</button>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="landing-section">
        <h2>Why Stay With Us</h2>
        <div className="landing-feature-grid">
          {features.map((f) => (
            <div className="feature-box" key={f.title}>
              <div className="icon" aria-hidden="true">{f.icon}</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: ABOUT */}
      <section id="about" className="landing-section">
        <h2>About EasePlace</h2>
        <p className="landing-about-text">
          EasePlace Reservation &amp; Monitoring System helps boarders browse rooms
          and manage their reservations, while admins can monitor rooms and
          reservation requests in one place.
        </p>
        <button type="button" className="landing-cta" onClick={onLoginClick}>Get Started</button>
        <div className="landing-foot">© 2026 EasePlace Boarding House. All rights reserved.</div>
      </section>
    </div>
  );
}