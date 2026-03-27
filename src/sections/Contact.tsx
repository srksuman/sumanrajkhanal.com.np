import SectionReveal from '../components/SectionReveal';
import ContactScene from '../components/ContactScene';
import { personalInfo } from '../data/portfolio';

export default function Contact() {
  const handleDownloadCV = () => {
    window.print();
  };

  return (
    <section className="section contact-section" id="contact">
      <ContactScene />
      <div className="container">
        <SectionReveal>
          <div className="contact-content">
            <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
            <h2 className="contact-heading">
              Let's Build <span>Something</span> Great
            </h2>
            <p className="contact-subtitle">
              I'm available for freelance projects, full-time opportunities, and
              technical consulting. Let's discuss how I can help bring your ideas to life.
            </p>

            <div className="contact-links">
              <a
                href={`mailto:${personalInfo.email}`}
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Suman Raj Khanal"
              >
                <div className="contact-link-icon">📧</div>
                <span className="contact-link-label">{personalInfo.email}</span>
              </a>

              <a
                href={personalInfo.github}
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <div className="contact-link-icon">💻</div>
                <span className="contact-link-label">GitHub</span>
              </a>

              <a
                href={personalInfo.linkedin}
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <div className="contact-link-icon">🔗</div>
                <span className="contact-link-label">LinkedIn</span>
              </a>
            </div>

            <button
              className="contact-cv-btn"
              onClick={handleDownloadCV}
              aria-label="Download CV as PDF"
            >
              📄 Download CV
            </button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
