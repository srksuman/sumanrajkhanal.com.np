import SectionReveal from '../components/SectionReveal';
import { services } from '../data/portfolio';

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionReveal>
          <div className="section-label">What I Do</div>
          <h2 className="section-title">
            Services <span>Offered</span>
          </h2>
        </SectionReveal>

        <div className="services-list">
          {services.map((service, index) => (
            <SectionReveal key={service.number} delay={index * 0.1}>
              <div className="service-item">
                <span className="service-number">{service.number}</span>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
