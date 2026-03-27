import { motion } from 'framer-motion';
import ParticleCanvas from '../components/ParticleCanvas';
import AnimatedCounter from '../components/AnimatedCounter';
import SectionReveal from '../components/SectionReveal';
import { personalInfo, stats } from '../data/portfolio';

const roles = ['Full Stack Developer', 'App Developer', 'DevOps Engineer', 'Web3 Developer'];

export default function Hero() {
  const handleScrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    window.print();
  };

  return (
    <section className="hero" id="hero">
      <ParticleCanvas />

      <div className="container hero-content">
        <SectionReveal>
          <div className="hero-eyebrow">
            <span className="line" />
            {personalInfo.location}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <h1 className="hero-name">
            <span className="gold">Suman</span>
            <br />
            <span className="outline">Raj</span> Khanal
          </h1>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <p className="hero-tagline">{personalInfo.tagline}</p>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <div className="hero-roles">
            {roles.map((role, i) => (
              <motion.span
                key={role}
                className="hero-role-pill"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                {role}
              </motion.span>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.4}>
          <div className="hero-stats">
            {stats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <div className="hero-stat-value">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.5}>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={handleScrollToProjects} aria-label="View Projects">
              <span>View Projects</span>
            </button>
            <button className="btn-outline" onClick={handleDownloadCV} aria-label="Download CV">
              Download CV
            </button>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.6}>
          <div className="hero-available">
            <span className="dot" />
            <span>Available for remote & international projects</span>
          </div>
        </SectionReveal>
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span className="hero-scroll-text">Scroll</span>
      </div>
    </section>
  );
}
