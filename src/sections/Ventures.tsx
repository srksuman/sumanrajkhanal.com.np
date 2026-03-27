import SectionReveal from '../components/SectionReveal';
import { ventures } from '../data/portfolio';

export default function Ventures() {
  return (
    <section className="section" id="ventures">
      <div className="container">
        <SectionReveal>
          <div className="section-label">Entrepreneurship</div>
          <h2 className="section-title">
            Ventures & <span>Brands</span>
          </h2>
        </SectionReveal>

        <div className="ventures-grid">
          {ventures.map((venture, index) => (
            <SectionReveal key={venture.name} delay={index * 0.15}>
              <div className="venture-card">
                <span className="venture-badge">{venture.role}</span>
                <h3 className="venture-name">{venture.name}</h3>
                <p className="venture-desc">{venture.description}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
