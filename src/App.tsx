import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import GrainOverlay from './components/GrainOverlay';
import Navbar from './components/Navbar';
import MusicToggle from './components/MusicToggle';
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return (saved === 'light' ? 'light' : 'dark');
  });

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
          <CustomCursor />
          <ScrollProgress />
          <GrainOverlay />
          <Navbar theme={theme} onToggleTheme={toggleTheme} />
          <MusicToggle />

          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Ventures />
            <Services />
            <Achievements />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
