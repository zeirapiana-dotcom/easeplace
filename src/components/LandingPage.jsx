import { useState, useEffect } from 'react';

const aboutSlides = [
  { src: '/images/about-1.jpg', caption: 'Cozy and comfortable rooms' },
  { src: '/images/about-2.jpg', caption: 'A warm and welcoming common area' },
  { src: '/images/about-3.jpg', caption: 'Safe, accessible location' },
];

export default function LandingPage({ onLoginClick }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // kusang magpalit ng picture (titigil kapag naka-hover)
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setSlide((s) => (s + 1) % aboutSlides.length);
    }, 4500);
    return () => clearTimeout(timer);
  }, [slide, paused]);

  function goPrev() {
    setSlide((s) => (s - 1 + aboutSlides.length) % aboutSlides.length);
  }
  function goNext() {
    setSlide((s) => (s + 1) % aboutSlides.length);
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const features = [
    {
      title: 'Browse Rooms',
      text: 'See every room with its price, capacity, amenities and live availability.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      ),
    },
    {
      title: 'Easy Reservation',
      text: 'Pick a room, choose your move-in date and submit your request in a few clicks.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      title: 'Track Your Request',
      text: 'Check if your reservation is pending, confirmed or cancelled anytime.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: 'Admin Dashboard',
      text: 'Property managers can monitor rooms, approve requests and manage listings.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  const steps = [
    { no: '01', title: 'Sign in', text: 'Log in as a boarder using your account or your Google account.' },
    { no: '02', title: 'Choose a room', text: 'Browse the available rooms and pick the one that fits your needs and budget.' },
    { no: '03', title: 'Get confirmed', text: 'Submit your reservation and wait for the property manager to confirm it.' },
  ];

  const values = [
    'Clean and well-maintained rooms',
    'Safe and secure environment',
    'Located in accessible areas',
    'Peaceful and quiet surroundings',
  ];

  const check = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="landing-nav">
        <div className="landing-nav-brand">
          <span className="landing-nav-logo">
            <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; }} />
          </span>
          EasePlace
        </div>
        <nav className="landing-nav-links">
          <button type="button" onClick={() => scrollToSection('home')}>Home</button>
          <button type="button" onClick={() => scrollToSection('features')}>Features</button>
          <button type="button" onClick={() => scrollToSection('how')}>How it works</button>
          <button type="button" onClick={() => scrollToSection('about')}>About</button>
          <button type="button" className="landing-login-btn" onClick={onLoginClick}>Login</button>
        </nav>
      </header>

      {/* SECTION 1: HERO */}
      <section id="home" className="lp-section lp-hero">
        <div className="lp-hero-grid">
          <div className="lp-hero-text">
            <div className="login-brand-row">
              <div className="lp-hero-logo" aria-hidden="true">
                <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <span className="system-tag" style={{ marginTop: 0 }}>Boarding House Reservation System</span>
            </div>

            <h1>
              Your comfortable stay,{' '}
              <span className="lp-accent">reserved in minutes.</span>
            </h1>

            <p className="lp-lead">
              EasePlace Boarding House offers comfort, cleanliness and safety for
              every guest. Browse rooms, send your reservation and track its
              status, all in one simple system.
            </p>

            <div className="lp-hero-actions">
              <button type="button" className="lp-btn lp-btn-gold" onClick={onLoginClick}>Login to Reserve</button>
              <button type="button" className="lp-btn lp-btn-ghost" onClick={() => scrollToSection('features')}>Learn more</button>
            </div>

            <div className="lp-stats">
              <div><b>24/7</b><span>Online reservation</span></div>
              <div><b>Real-time</b><span>Room availability</span></div>
              <div><b>Easy</b><span>Request tracking</span></div>
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-room-card">
              <div className="lp-room-photo">
                <img src="/images/hero-room.jpg" alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="lp-badge">Available</span>
              </div>
              <div className="lp-room-body">
                <div className="lp-room-name">Room 302</div>
                <div className="lp-room-type">Solo Nook · Single with balcony</div>
                <div className="lp-room-price">₱3,800 <span>/ month</span></div>
                <div className="lp-chips">
                  <span>Free Wi-Fi</span>
                  <span>Own CR</span>
                  <span>Balcony access</span>
                </div>
                <button type="button" className="lp-btn lp-btn-gold lp-btn-block" onClick={onLoginClick}>Reserve room</button>
              </div>
            </div>
            <div className="lp-float lp-float-top"><i className="lp-dot"></i> Reservation confirmed</div>
            <div className="lp-float lp-float-bottom"><i className="lp-dot lp-dot-gold"></i> Real-time availability</div>
          </div>
        </div>

        <button type="button" className="lp-scroll" onClick={() => scrollToSection('features')} aria-label="Scroll down">
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="lp-section lp-alt">
        <div className="lp-head">
          <span className="lp-eyebrow">Why EasePlace</span>
          <h2>A simpler way to find and reserve your room</h2>
          <p>Everything you need to manage your stay, without the paperwork and long waiting.</p>
        </div>
        <div className="lp-feature-grid">
          {features.map((f) => (
            <div className="lp-feature-card" key={f.title}>
              <div className="lp-feature-icon" aria-hidden="true">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how" className="lp-section">
        <div className="lp-head">
          <span className="lp-eyebrow">How it works</span>
          <h2>Reserve in three easy steps</h2>
        </div>
        <div className="lp-steps">
          {steps.map((s) => (
            <div className="lp-step" key={s.no}>
              <div className="lp-step-no">{s.no}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <button type="button" className="lp-btn lp-btn-gold lp-center-btn" onClick={onLoginClick}>Get Started</button>
      </section>

      {/* SECTION 4: ABOUT (with slideshow) */}
      <section id="about" className="lp-section lp-alt">
        <div className="lp-about-grid">
          <div
            className="lp-about-photo"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* fallback na lalabas kung wala pang picture */}
            <svg className="lp-about-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="72" height="72" aria-hidden="true">
              <path d="M3 11l9-8 9 8" />
              <path d="M5 10v10h14V10" />
              <path d="M10 20v-6h4v6" />
            </svg>

            {aboutSlides.map((s, i) => (
              <div className={`lp-slide${i === slide ? ' active' : ''}`} key={s.src} aria-hidden={i !== slide}>
                <img src={s.src} alt={s.caption} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            ))}

            <div className="lp-slide-caption">{aboutSlides[slide].caption}</div>

            <button type="button" className="lp-slide-arrow lp-slide-prev" onClick={goPrev} aria-label="Previous photo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className="lp-slide-arrow lp-slide-next" onClick={goNext} aria-label="Next photo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>

            <div className="lp-slide-dots">
              {aboutSlides.map((s, i) => (
                <button
                  type="button"
                  key={s.src}
                  className={`lp-slide-dot${i === slide ? ' active' : ''}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Show photo ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="lp-about-text">
            <span className="lp-eyebrow">About us</span>
            <h2>About EasePlace Boarding House</h2>
            <p>
              We provide comfortable and affordable rooms designed to feel like
              home. The EasePlace Reservation &amp; Monitoring System helps boarders
              reserve rooms easily, while property managers can keep track of
              rooms and requests in one place.
            </p>
            <ul className="lp-values">
              {values.map((v) => (
                <li key={v}><span className="lp-check">{check}</span>{v}</li>
              ))}
            </ul>
            <button type="button" className="lp-btn lp-btn-gold" onClick={onLoginClick}>Login to Reserve</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="footer-brand">EasePlace</div>
              <p>
                Providing comfort, cleanliness and safety for every guest. Our
                spaces are designed to feel warm, and make everyone feel like home.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <div className="footer-col">
                <h4>Contact us</h4>
                <ul>
                  <li><a href="#about">📍 Odiong, Roxas Oriental Mindoro, Philippines</a></li>
                  <li><a href="tel:+639123456789">📞 +63 912 345 6789</a></li>
                  <li><a href="mailto:zeirapiana@gmail.com">✉️ zeirapiana@gmail.com</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 EasePlace Boarding House. All rights reserved.
        </div>
      </footer>
    </div>
  );
}