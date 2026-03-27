import SectionReveal from '../components/SectionReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import { achievements } from '../data/portfolio';

export default function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <SectionReveal>
          <div className="section-label">Milestones</div>
          <h2 className="section-title">
            Key <span>Achievements</span>
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="achievements-row">
            {achievements.map((item) => (
              <div key={item.label} className="achievement-item">
                <div className="achievement-value">
                  <AnimatedCounter value={item.value} suffix={item.suffix} />
                </div>
                <div className="achievement-label">{item.label}</div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
