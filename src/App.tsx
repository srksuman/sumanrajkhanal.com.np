import { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import GrainOverlay from './components/GrainOverlay';
import Navbar from './components/Navbar';
import MusicToggle from './components/MusicToggle';
import FloatingGeometry from './components/FloatingGeometry';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Ventures from './sections/Ventures';
import Services from './sections/Services';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

import clickOpenSound from './assets/click-open.wav';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return (saved === 'light' ? 'light' : 'dark');
  });

  const globalClickAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    globalClickAudio.current = new Audio(clickOpenSound);
    globalClickAudio.current.volume = 0.3;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, [role="button"]');
      
      const isExcluded = target.closest('.nav-toggle, .music-toggle, .nav-close');

      if (isClickable && !isExcluded && globalClickAudio.current) {
        globalClickAudio.current.currentTime = 0;
        globalClickAudio.current.play().catch(() => {});
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <>
          <ScrollProgress />
          <GrainOverlay />
          <Navbar theme={theme} onToggleTheme={toggleTheme} />
          <MusicToggle />

          <main>
            <Hero />
            <About />
            <Skills />
            <FloatingGeometry type="octahedron" className="divider-1" />
            <Experience />
            <Projects />
            <FloatingGeometry type="tetrahedron" color={0x7b68ee} className="divider-2" />
            <Ventures />
            <Services />
            <FloatingGeometry type="dodecahedron" className="divider-3" />
            <Achievements />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
