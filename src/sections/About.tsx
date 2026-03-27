import SectionReveal from '../components/SectionReveal';
import sumanImg from '../assets/suman.jpg';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionReveal>
          <div className="section-label">About</div>
          <h2 className="section-title">
            Crafting <span>Digital Experiences</span>
          </h2>
        </SectionReveal>

        <div className="about-grid">
          <SectionReveal delay={0.1}>
            <div className="about-avatar">
              <img
                src={sumanImg}
                alt="Suman Raj Khanal - Full Stack Developer"
                className="about-avatar-img"
              />
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="about-text">
              <p>
                I'm a Full Stack Developer, App Developer, DevOps Engineer, and Web3 Developer
                based in Kathmandu, Nepal. With over 4 years of professional experience,
                I specialize in building scalable web applications, mobile apps, and
                decentralized platforms.
              </p>
              <p>
                My journey began during my final year of BSc (Hons) Computer Science at the
                University of Wolverhampton, where I graduated as the Batch Topper.
                Since then, I've shipped 20+ real-world projects, founded 3 ventures,
                and worked with international clients to deliver production-grade software.
              </p>
              <p>
                I'm passionate about clean architecture, performance optimization, and
                creating products that make a real impact. Currently studying the
                International Master in Business Administration (IMBA) at the University
                of Wolverhampton, complementing my technical expertise with strategic
                business thinking.
              </p>

              <div className="about-facts">
                <div className="about-fact">
                  <div className="about-fact-label">Location</div>
                  <div className="about-fact-value">Kathmandu, Nepal</div>
                </div>
                <div className="about-fact">
                  <div className="about-fact-label">Experience</div>
                  <div className="about-fact-value">4+ Years Professional</div>
                </div>
                <div className="about-fact">
                  <div className="about-fact-label">Specialization</div>
                  <div className="about-fact-value">Full Stack · DevOps · Web3</div>
                </div>
                <div className="about-fact">
                  <div className="about-fact-label">Education</div>
                  <div className="about-fact-value">
                    IMBA, University of Wolverhampton (Current)
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
