import SectionReveal from '../components/SectionReveal';
import SkillsGlobe from '../components/SkillsGlobe';
import { skills, skillIcons } from '../data/portfolio';

export default function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <SkillsGlobe />
      <div className="container">
        <SectionReveal>
          <div className="section-label">Expertise</div>
          <h2 className="section-title">
            Skills & <span>Technologies</span>
          </h2>
        </SectionReveal>

        <div className="skills-grid">
          {Object.entries(skills).map(([category, items], index) => (
            <SectionReveal key={category} delay={index * 0.1}>
              <div className="skill-card">
                <div className="skill-card-icon">{skillIcons[category] || '💻'}</div>
                <h3 className="skill-card-title">{category}</h3>
                <div className="skill-pills">
                  {items.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
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
