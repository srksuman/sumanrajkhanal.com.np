import { useState, useEffect, useRef } from 'react';
import { navLinks } from '../data/portfolio';

// Import sound effects
import clickOpenSound from '../assets/click-open.wav';
import clickCloseSound from '../assets/click-close.wav';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const isInitialMount = useRef(true);

  // Audio elements
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const closeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    openAudioRef.current = new Audio(clickOpenSound);
    closeAudioRef.current = new Audio(clickCloseSound);
    openAudioRef.current.volume = 0.5;
    closeAudioRef.current.volume = 0.5;
  }, []);

  // Play sound when menu state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (menuOpen) {
      if (openAudioRef.current) {
        openAudioRef.current.currentTime = 0;
        openAudioRef.current.play().catch(() => {});
      }
    } else {
      if (closeAudioRef.current) {
        closeAudioRef.current.currentTime = 0;
        closeAudioRef.current.play().catch(() => {});
      }
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const sections = document.querySelectorAll('.section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const handleDownloadCV = () => {
    window.print();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        <a href="#" className="navbar-logo" aria-label="Suman Raj Khanal - Home">
          <span className="gold">S</span>RK
        </a>

        {/* Mobile overlay */}
        {menuOpen && (
          <div
            className="nav-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {/* Close button inside mobile menu */}
          <button
            className="nav-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`navbar-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}

          <div className="nav-status">
            <span className="status-dot" />
            Available
          </div>

          <button className="nav-cv-btn" onClick={handleDownloadCV} aria-label="Download CV as PDF">
            Download CV
          </button>
        </div>

        {/* Theme toggle + Hamburger */}
        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
