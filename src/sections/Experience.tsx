import SectionReveal from '../components/SectionReveal';
import { experience } from '../data/portfolio';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionReveal>
          <div className="section-label">Journey</div>
          <h2 className="section-title">
            Professional <span>Experience</span>
          </h2>
        </SectionReveal>

        <div className="timeline">
          {experience.map((item, index) => (
            <SectionReveal key={item.period} delay={index * 0.15}>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-period">{item.period}</div>
                <h3 className="timeline-role">{item.role}</h3>
                <div className="timeline-bullets">
                  {item.bullets.map((bullet, i) => (
                    <div key={i} className="timeline-bullet">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
