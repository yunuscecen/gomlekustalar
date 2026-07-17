import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import Container from "../common/Container";

const CtaSection = ({ section }) => {
  return (
    <section className="cta-section">
      <Container>
        <div className="cta-section__inner">
          <span className="cta-section__watermark">UG</span>

          <div className="cta-section__content">
            {section.eyebrow && (
              <span className="section-kicker">
                {section.eyebrow}
              </span>
            )}

            <h2>{section.title}</h2>

            {section.description && (
              <p>{section.description}</p>
            )}
          </div>

          {section.cta?.label && section.cta?.href && (
            <Link
              to={section.cta.href}
              className="circle-link"
              aria-label={section.cta.label}
            >
              <ArrowUpRight size={25} />
              <span>{section.cta.label}</span>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;