import SectionReveal from '../components/SectionReveal';
import { projects } from '../data/portfolio';

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionReveal>
          <div className="section-label">Work</div>
          <h2 className="section-title">
            Featured <span>Projects</span>
          </h2>
        </SectionReveal>

        {/* Featured Projects */}
        <div className="projects-featured">
          {featured.map((project, index) => (
            <SectionReveal key={project.title} delay={index * 0.15}>
              <div className="project-card featured">
                  <div className="project-card-body">
                  <h3 className="project-card-title">{project.title}</h3>
                  <div className="project-card-subtitle">{project.subtitle}</div>
                  <p className="project-card-desc">{project.description}</p>
                  <div className="project-card-stack">
                    {project.stack.map((tech) => (
                      <span key={tech} className="project-stack-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-card-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link"
                      aria-label={`Visit ${project.title}`}
                    >
                      View Live →
                    </a>
                  )}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Other Projects */}
        <div className="projects-grid">
          {others.map((project, index) => (
            <SectionReveal key={project.title} delay={index * 0.1}>
              <div className="project-card">
                  <div className="project-card-body">
                  <h3 className="project-card-title">{project.title}</h3>
                  <div className="project-card-subtitle">{project.subtitle}</div>
                  <p className="project-card-desc">{project.description}</p>
                  <div className="project-card-stack">
                    {project.stack.map((tech) => (
                      <span key={tech} className="project-stack-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link"
                      aria-label={`Visit ${project.title}`}
                    >
                      View Live →
                    </a>
                  )}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
